import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('API pública do visualizador expõe a transição real do Organizar V2', () => {
  const viewer = read('js/document-viewer.js');
  const publicApi = viewer.match(/window\.PortalPdfViewer = Object\.freeze\(\{([\s\S]*?)\}\);/);
  assert.ok(publicApi, 'A API pública do visualizador deve existir.');
  assert.match(publicApi[1], /\bsetOrganizerMode\s*,/);
  const sandbox = { window: {} };
  vm.runInNewContext(viewer, sandbox);
  for (const method of ['open', 'close', 'getViewState', 'setThumbnailActions', 'setOrganizerMode', 'setEditorObjects', 'scrollToPage', 'zoomIn', 'zoomOut', 'fitWidth']) {
    assert.equal(typeof sandbox.window.PortalPdfViewer[method], 'function', `API pública: ${method}`);
  }
  assert.match(viewer, /session\.root\.dataset\.organizerMode = next \? 'true' : 'false'/);
});

test('troca de modo serializa a renderização completa da miniatura e invalida geração antiga', () => {
  const viewer = read('js/document-viewer.js');
  const render = viewer.slice(viewer.indexOf('  async function renderThumbnail('), viewer.indexOf('  function installObservers('));
  const toggle = viewer.slice(viewer.indexOf('  function setOrganizerMode('), viewer.indexOf('  async function open('));
  assert.match(render, /await record\.thumbnailPromise;\s*return renderThumbnail\(session, pageNumber\)/);
  assert.match(render, /generation === \(session\.thumbnailGeneration \|\| 0\)/);
  assert.match(render, /if \(!page \|\| !isCurrentThumbnail\(\)\) return/);
  assert.match(render, /if \(isCurrentThumbnail\(\)\) \{\s*record\.rendered = true/);
  assert.match(toggle, /session\.thumbnailGeneration = \(session\.thumbnailGeneration \|\| 0\) \+ 1/);
  assert.match(toggle, /if \(session\.thumbObserver\)/);
  assert.match(toggle, /session\.thumbObserver\.unobserve\(record\.button\)/);
  assert.match(toggle, /session\.thumbObserver\.observe\(record\.button\)/);
  assert.match(toggle, /else if \(typeof IntersectionObserver !== 'function'\)/);
  assert.match(toggle, /renderThumbnail\(session, pageNumber\)\.catch/);
  assert.doesNotMatch(toggle, /record\.canvas\.(?:width|height) = 0/);
});

function elementSourceById(source, id) {
  const opening = new RegExp(`<([a-z][\\w:-]*)\\b[^>]*\\bid=["']${id}["'][^>]*>`, 'i').exec(source);
  assert.ok(opening, `Elemento #${id} não encontrado.`);

  const tag = opening[1];
  const tags = new RegExp(`</?${tag}\\b[^>]*>`, 'gi');
  tags.lastIndex = opening.index;
  let depth = 0;
  let match;
  while ((match = tags.exec(source))) {
    if (match[0].startsWith('</')) depth -= 1;
    else if (!match[0].endsWith('/>')) depth += 1;
    if (depth === 0) return source.slice(opening.index, tags.lastIndex);
  }

  assert.fail(`Elemento #${id} não foi fechado.`);
}

test('Central usa somente Worker para Drive e delega persistência documental ao cache criptografado', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');

  assert.doesNotMatch(html, /frame-src/);
  assert.match(html, /Somente leitura/);
  assert.match(client, /\/api\/documents\/drive\/list/);
  assert.match(client, /\/api\/documents\/drive\/search/);
  assert.match(client, /\/api\/documents\/drive\/content\//);
  assert.doesNotMatch(client, /googleapis\.com|accounts\.google\.com/);
  assert.doesNotMatch(client, /localStorage|sessionStorage|indexedDB|caches\.open/);
  assert.match(html, /document-cache\.js\?v=20260912-1/);
  assert.match(client, /URL\.revokeObjectURL/);
  assert.match(client, /cache:\s*'no-store'/);
});

test('gestão de acesso sai da Central e usa função adicional acumulável em Usuários e acessos', () => {
  const documentsHtml = read('documentos/index.html');
  const documentsClient = read('js/documents.js');
  const adminHtml = read('admin/usuarios/index.html');
  const adminClient = read('js/admin-users.js');

  assert.doesNotMatch(documentsHtml, /Acessos à Central/);
  assert.doesNotMatch(documentsClient, /documentsAccessList|loadAccessAdmin|saveAccountAccess/);
  assert.match(documentsHtml, /Gerenciar cargos e acessos/);
  assert.match(adminHtml, /Cargos\/funções adicionais \(acumuláveis\)/);
  assert.match(adminHtml, /Regulador\(a\) — acesso à Central de Documentos/);
  assert.match(adminClient, /additionalRoles/);
  assert.match(adminClient, /medico: 'Médico\(a\)'/);
  assert.match(adminClient, /documentos: 'Regulador\(a\)'/);
});

test('catálogo mostra a Central apenas por capability documental', () => {
  const source = read('js/tools-catalog.js');
  assert.match(source, /documentCapabilities\?\.view \|\| user\?\.documentCapabilities\?\.manage/);
  assert.match(source, /href: '\/documentos\/'/);
  assert.match(source, /Central de Documentos/);
});

test('service worker fornece stream PDF efêmero sem persistir bytes no Cache Storage', () => {
  const source = read('portal-sw.js');
  assert.match(source, /'\/documentos\/'/);
  assert.match(source, /url\.pathname\.startsWith\('\/api\/'\)/);
  assert.match(source, /request\.headers\.has\('Range'\)/);
  assert.match(source, /DOCUMENT_STREAM_PREFIX = '\/__portal_document_pdf\/'/);
  assert.match(source, /const documentStreams = new Map\(\)/);
  assert.match(source, /PORTAL_DOCUMENT_STREAM_REGISTER/);
  assert.match(source, /PORTAL_DOCUMENT_STREAM_RELEASE/);
  assert.match(source, /headers\.set\('Range', range\)/);
  assert.match(source, /Authorization: entry\.authorization/);
  assert.match(source, /'Cache-Control': 'no-store'/);
  assert.match(source, /CACHE_VERSION = '20260915-11'/);
});

test('observabilidade documental continua sem propriedades identificáveis', () => {
  const server = read('worker/observability.js');
  const client = read('js/portal-observability.js');

  for (const source of [server, client]) {
    assert.match(source, /drive_folder_opened/);
    assert.match(source, /drive_search_completed/);
    assert.match(source, /pdf_open_started/);
    assert.match(source, /pdf_first_page_visible/);
    assert.match(source, /pdf_ready/);
    assert.match(source, /'\/documentos\/'/);
    assert.doesNotMatch(source, /file_name|filename|fileId|patient_name|cpf|cns/i);
  }

  const documentsClient = read('js/documents.js');
  assert.doesNotMatch(documentsClient, /capture\([^\n]*item\.name/);
  assert.doesNotMatch(documentsClient, /capture\([^\n]*item\.ref/);
  assert.doesNotMatch(documentsClient, /capture\([^\n]*searchQuery/);
});

test('modo progressivo prioriza primeira página e mantém fallback Blob', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const worker = read('portal-sw.js');

  assert.match(html, /documents\.js\?v=20260915-7/);
  assert.match(client, /registerProgressiveStream/);
  assert.match(client, /PORTAL_DOCUMENT_STREAM_REGISTER/);
  assert.match(client, /setInterval\(refreshProgressiveStream, 5000\)/);
  assert.match(client, /pdf_first_page_visible/);
  assert.match(client, /loadPdfBlobFallback/);
  assert.match(client, /URL\.createObjectURL/);
  assert.match(worker, /DOCUMENT_STREAM_TTL_MS = 20000/);
  assert.doesNotMatch(worker, /localStorage|sessionStorage|indexedDB/);
});

test('cache local criptografa PDFs, limita tamanho e invalida por versão', () => {
  const cache = read('js/document-cache.js');
  const client = read('js/documents.js');

  assert.match(cache, /DB_NAME = 'regulacao\.portal\.documents\.cache\.v1'/);
  assert.match(cache, /HKDF/);
  assert.match(cache, /AES-GCM/);
  assert.match(cache, /CACHE_TTL_MS = 12 \* 60 \* 60 \* 1000/);
  assert.match(cache, /MAX_TOTAL_BYTES = 256 \* 1024 \* 1024/);
  assert.match(cache, /MAX_FILE_BYTES = 50 \* 1024 \* 1024/);
  assert.match(cache, /key \+ ':' \+ fileVersion/);
  assert.match(cache, /portal:session-cleared/);
  assert.doesNotMatch(cache, /file_name|filename|patient_name|cpf|cns|diagnostico|cid/i);

  assert.match(client, /readCachedPdf/);
  assert.match(client, /storeCachedPdf/);
  assert.match(client, /warmPdfCache/);
  assert.match(client, /scheduleLikelyPdfWarmup/);
  assert.match(client, /cacheState: 'hit'/);
  assert.match(client, /sourceLabel: 'cache'/);
  assert.match(client, /source: 'cache'|source,?/);
});


test('cabeçalho do visualizador preserva ações e trunca somente o título do PDF', () => {
  const html = read('documentos/index.html');
  const css = read('css/documents.css');

  assert.match(html, /documents\.css\?v=20260915-7/);
  assert.match(html, /id="editPdfButton"[^>]*>Editar PDF<\/button>/);
  assert.match(css, /\.documents-viewer-head > div:first-child\s*\{[^}]*min-width:\s*0;[^}]*flex:\s*1 1 auto;/s);
  assert.match(css, /\.documents-viewer-actions\s*\{[^}]*flex:\s*0 0 auto;/s);
  assert.match(css, /\.documents-viewer-head strong\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*100%;[^}]*text-overflow:\s*ellipsis;/s);
  assert.doesNotMatch(css, /\.documents-viewer-head strong\s*\{[^}]*max-width:\s*min\(54vw,\s*640px\)/s);
});

test('visualizador próprio usa PDF.js self-hosted sem fallback nativo', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const viewer = read('js/document-viewer.js');

  assert.match(html, /id="documentsCustomViewer"/);
  assert.match(html, /id="pdfThumbnailRail"/);
  assert.match(html, /id="pdfPageScroll"/);
  assert.match(html, /id="pdfZoomOutButton"/);
  assert.match(html, /id="pdfFitWidthButton"/);
  assert.doesNotMatch(html, /documentsPdfFrame|<(?:iframe|embed|object)\b|frame-src/i);
  assert.match(html, /document-viewer\.js\?v=20260915-11/);
  assert.match(html, /documents\.js\?v=20260915-7/);
  assert.match(html, /documents\.css\?v=20260915-7/);

  assert.match(viewer, /PDFJS_VERSION = '6\.3\.289'/);
  assert.match(viewer, /\/vendor\/pdfjs-legacy\/pdf\.min\.mjs/);
  assert.match(viewer, /\/vendor\/pdfjs-legacy\/pdf\.worker\.min\.mjs/);
  assert.match(viewer, /enableScripting:\s*false/);
  assert.match(viewer, /isEvalSupported:\s*false/);
  assert.match(viewer, /cMapUrl:\s*CMAP_URL/);
  assert.match(viewer, /standardFontDataUrl:\s*STANDARD_FONT_URL/);
  assert.match(viewer, /wasmUrl:\s*WASM_URL/);
  assert.match(viewer, /iccUrl:\s*ICC_URL/);
  assert.match(viewer, /IntersectionObserver/);
  assert.match(viewer, /MAX_CANVAS_PIXELS/);
  assert.match(viewer, /async function settleRenderTask/);
  assert.match(viewer, /canvas:\s*record\.canvas/);
  assert.doesNotMatch(viewer, /canvasContext:\s*context/);
  assert.match(viewer, /if \(record\.renderTask === task\) record\.renderTask = null/);
  assert.doesNotMatch(viewer, /cdn\.jsdelivr\.net|unpkg\.com|googleapis\.com/);

  assert.ok(fs.statSync(path.join(root, 'vendor/pdfjs-legacy/pdf.min.mjs')).size > 100_000);
  assert.ok(fs.statSync(path.join(root, 'vendor/pdfjs-legacy/pdf.worker.min.mjs')).size > 500_000);
  assert.ok(fs.existsSync(path.join(root, 'vendor/pdfjs-legacy/LICENSE')));

  assert.match(client, /openWithPortalViewer/);
  assert.match(client, /showPortalViewerFailure/);
  assert.match(client, /loadPdfBlobFallback/);
  assert.doesNotMatch(client, /showIframeViewerSurface|documentsPdfFrame|els\.frame|createElement\(['"](?:iframe|embed|object)['"]\)/i);
  assert.doesNotMatch(viewer, /createElement\(['"](?:iframe|embed|object)['"]\)/i);
  assert.match(client, /registerProgressiveStream/);
  assert.match(client, /pdf_first_page_visible/);
  assert.match(client, /pdfReadyEmitted/);
});

test('observadores entram somente depois da primeira renderização do PDF.js', () => {
  const viewer = read('js/document-viewer.js');
  const firstRender = viewer.indexOf('await Promise.all([');
  const observers = viewer.indexOf('installObservers(session);', firstRender);
  assert.ok(firstRender >= 0);
  assert.ok(observers > firstRender);
  assert.match(viewer, /if \(!force && sameRender\) \{\s*await settleRenderTask\(record\);\s*return;/s);
});


test('editor usa os controles da mesma superfície PDF.js sem lista textual paralela', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const viewer = read('js/document-viewer.js');
  const editor = read('js/document-editor.js');
  const css = read('css/documents.css');
  const viewerSurface = elementSourceById(html, 'documentsCustomViewer');

  assert.match(viewerSurface, /id="documentsEditor"/);
  assert.match(viewerSurface, /id="editorUndoButton"/);
  assert.match(viewerSurface, /id="editorRedoButton"/);
  assert.match(viewerSurface, /id="editorMergeButton"/);
  assert.match(viewerSurface, /id="editorOrganizeButton"/);
  assert.match(viewerSurface, /id="editorBlankPageButton"/);
  assert.match(viewerSurface, /id="editorMergePanel"/);
  assert.match(viewerSurface, /id="editorImageButton"/);
  assert.match(viewerSurface, /id="editorCropButton"[^>]*disabled/);
  assert.match(viewerSurface, /id="editorSelectButton"/);
  assert.match(viewerSurface, /id="editorWriteButton"/);
  assert.doesNotMatch(viewerSurface, /id="editorWriteButton"[^>]*disabled/);
  assert.match(viewerSurface, /id="editorOverlayImageButton"/);
  assert.doesNotMatch(viewerSurface, /id="editorOverlayImageButton"[^>]*disabled/);
  assert.match(viewerSurface, /id="editorDrawButton"[^>]*disabled/);
  assert.match(viewerSurface, /id="editorExitButton"/);
  assert.match(viewerSurface, /id="pdfThumbnailRail"/);
  assert.match(viewerSurface, /id="pdfPageScroll"/);
  assert.doesNotMatch(html, /id="documentsEditorPages"/);
  assert.doesNotMatch(client, /documentsEditorPages|data-editor-index|renderEditorPages/);
  assert.match(html, /document-viewer\.js\?v=20260915-11/);
  assert.match(html, /documents\.js\?v=20260915-7/);
  assert.match(html, /documents\.css\?v=20260915-7/);

  assert.match(client, /async function openEditorWithPortalViewer/);
  assert.match(client, /viewer\.getViewState(?:\?\.)?\(\)/);
  assert.match(client, /(?:viewer|PortalPdfViewer)\?*\.setThumbnailActions(?:\?\.)?\(/);
  assert.match(client, /initialViewState:/);
  assert.match(client, /onThumbnailAction:/);
  assert.match(client, /await openEditorWithPortalViewer\(blob/);
  assert.match(client, /restoreOriginalPortalViewer/);
  assert.match(client, /showEditorPortalFailure/);
  assert.doesNotMatch(client, /showEditorIframeFallback/);
  assert.doesNotMatch(client, /modo de compatibilidade|compatibility-mode/);
  assert.doesNotMatch(css, /compatibility-mode/);
  assert.match(editor, /useObjectStreams:\s*false/);

  assert.match(viewer, /initialViewState = null/);
  assert.match(viewer, /onThumbnailAction = null/);
  assert.match(viewer, /function getViewState\(/);
  assert.match(viewer, /function setThumbnailActions\(/);
  assert.match(viewer, /function setOrganizerMode\(/);
  assert.match(viewer, /ORGANIZER_THUMB_WIDTH = 210/);
  assert.match(viewer, /if \(!session\.fitMode \|\| session\.organizerMode \|\| !isCurrentSession\(session\)\) return;/);
  assert.match(viewer, /getViewState,/);
  assert.match(viewer, /setThumbnailActions,/);
  assert.match(viewer, /dataset\.thumbnailAction/);
  assert.match(viewer, /portal-pdf-thumb-actions/);

  assert.match(css, /\.portal-pdf-thumb-actions/);
  assert.match(css, /\.portal-pdf-thumb-action\.danger/);
  assert.doesNotMatch(html, /<(?:iframe|embed|object)\b/i);
  assert.doesNotMatch(client, /createElement\(['"](?:iframe|embed|object)['"]\)/i);
});

test('ciclo assíncrono do editor não fecha um visualizador mais novo nem aceita mutações concorrentes', () => {
  const client = read('js/documents.js');

  assert.match(client, /editorStartSeq:\s*0/);
  assert.match(client, /editorBusy:\s*false/);
  assert.match(client, /const openId = state\.pdfOpenId/);
  assert.match(client, /startSeq === state\.editorStartSeq[\s\S]{0,180}openId === state\.pdfOpenId[\s\S]{0,180}item === state\.pdfItem/);
  assert.match(client, /if \(!isCurrentStart\(\)\) return;/);
  assert.match(client, /if \(session !== state\.editorSession \|\| seq !== state\.editorBuildSeq\) \{\s*return false;\s*\}/);
  assert.doesNotMatch(client, /if \(session !== state\.editorSession \|\| seq !== state\.editorBuildSeq\) \{\s*viewer\.close/);
  assert.match(client, /if \(openId !== state\.pdfOpenId \|\| state\.editorSession\) return false;\s*viewer\.close/);
  assert.doesNotMatch(client, /if \(openId !== state\.pdfOpenId\) \{\s*viewer\.close/);
  assert.match(client, /catch \(_\) \{\s*if \(openId !== state\.pdfOpenId\) return false;\s*viewer\.close\(\);/);
  assert.match(client, /if \(!editor \|\| !session \|\| state\.editorBusy\) return false;/);
  assert.match(client, /setEditorBusy\(true\);[\s\S]{0,1800}buildEditorPreview\(\{[\s\S]{0,300}allowBusy:\s*true/);
  assert.match(client, /restoreEditorFocus/);
});

test('visualizador invalida aberturas obsoletas sem destruir a sessão vencedora', () => {
  const viewer = read('js/document-viewer.js');

  assert.match(viewer, /let openGeneration = 0/);
  assert.match(viewer, /generation: \+\+openGeneration/);
  assert.match(viewer, /const invocation = beginOpenInvocation\(\)/);
  assert.match(viewer, /waitForInvocation\(invocation, loadingTask\.promise\)/);
  assert.match(viewer, /session\.openGeneration === openGeneration/);
  assert.match(viewer, /function close\(\) \{[\s\S]{0,180}openGeneration \+= 1;[\s\S]{0,180}cancelInvocation\(invocation\);[\s\S]{0,180}closeActiveSession\(\);/);
  assert.match(viewer, /function abandonSession\(session\) \{[\s\S]{0,220}const ownsSurface = active === session;[\s\S]{0,220}clearSurface: ownsSurface/);
  assert.match(viewer, /if \(input === OPEN_CANCELLED \|\| !isCurrentInvocation\(invocation\)\) return null;/);
  assert.match(viewer, /const stale = !isCurrentSession\(session\);\s*abandonSession\(session\);\s*if \(stale\) return null;/);
  assert.doesNotMatch(viewer, /if \(active === session\) close\(\)/);
  assert.match(viewer, /if \(clearSurface\) \{\s*clearNode\(session\.pagesRoot\);\s*clearNode\(session\.thumbnailsRoot\);/);
  assert.match(viewer, /if \(!isCurrentSession\(session\) \|\| session\.firstPageNotified\) return;/);
  assert.match(viewer, /session\.pageObserver\?\.disconnect\?\.\(\);/);
  assert.match(viewer, /for \(const record of session\.pages\.values\(\)\) clearRenderedPage\(record\);/);
  assert.match(viewer, /for \(const record of session\.thumbs\.values\(\)\) \{\s*cancelRender\(record\);/);
  assert.match(viewer, /safelyDestroy\(loadingTask\);\s*safelyDestroy\(document\);/);
  assert.match(viewer, /thumbnailsRoot\.addEventListener\('click', session\.thumbClick = \(event\) => \{\s*if \(!isCurrentSession\(session\)\) return;/);
});

test('editor V2 expõe união posicionada e sincroniza seleção do catálogo', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');

  assert.match(html, /id="editorMergeButton"[^>]*title="Unir outro PDF"/);
  assert.match(html, /id="editorMergePanel"/);
  assert.match(html, /value="after-document"/);
  assert.match(html, /value="before-document"/);
  assert.match(html, /value="after-page"/);
  assert.match(client, /editorMerge:\s*document\.getElementById\('editorMergeButton'\)/);
  assert.match(client, /function refreshPdfListActions\(\)/);
  assert.match(client, /'Selecionar para unir'/);
  assert.match(client, /'Já no editor'/);
  assert.match(client, /function choosePdfToMerge\(\)/);
  assert.match(client, /function prepareMergePdf\(item\)/);
  assert.match(client, /function mergeInsertAt\(\)/);
  assert.match(client, /async function applyPendingMerge\(\)/);
  assert.match(client, /mergePdfIntoEditor\(state\.pendingMergeItem, \{ insertAt: mergeInsertAt\(\) \}\)/);
  assert.match(client, /prepareMergePdf\(item\)/);
});

test('editor diferencia imagem como nova página de Colar imagem sobre página', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const editor = read('js/document-editor.js');
  const viewer = read('js/document-viewer.js');
  const observability = read('js/portal-observability.js');

  assert.match(html, /id="editorImageButton"[^>]*title="Adicionar imagem como nova página"/);
  assert.match(html, /id="editorOverlayImageButton"[^>]*title="Colar imagem sobre a página"/);
  assert.doesNotMatch(html, /id="editorOverlayImageButton"[^>]*disabled/);
  assert.match(html, /id="editorWriteButton"[^>]*title="Escrever sobre a página"/);
  assert.doesNotMatch(html, /id="editorWriteButton"[^>]*disabled/);
  assert.match(html, /id="editorSelectButton"/);
  assert.match(html, /id="editorObjectToolbar"/);
  assert.match(html, /document-editor\.js\?v=20260915-3/);
  assert.match(html, /documents\.js\?v=20260915-7/);
  assert.match(client, /handleEditorPaste/);
  assert.match(client, /addImageBlobToEditor/);
  assert.match(client, /addOverlayImageFile/);
  assert.match(client, /startWriteObjects/);
  assert.match(editor, /async function addImageOverlay/);
  assert.match(editor, /function addTextObject/);
  assert.match(editor, /function updateObject/);
  assert.match(editor, /function objectModel/);
  assert.match(viewer, /function setEditorObjects/);
  assert.match(viewer, /portal-pdf-object/);
  assert.match(observability, /'insert_image'/);
});

test('editor PDF é local, reversível e separado da escrita no Drive', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const editor = read('js/document-editor.js');

  assert.match(html, /document-editor\.js\?v=20260915-3/);
  assert.match(html, /Editar PDF/);
  assert.match(html, /id="editorExitButton"/);
  assert.match(editor, /\/vendor\/pdf-lib\/pdf-lib\.min\.js/);
  assert.doesNotMatch(editor, /https?:\/\//);
  assert.doesNotMatch(html, /cdn\.jsdelivr\.net/);
  assert.ok(fs.statSync(path.join(root, 'vendor/pdf-lib/pdf-lib.min.js')).size > 100_000);

  assert.match(client, /canEditDocuments/);
  assert.match(client, /caps\.edit === true/);
  assert.match(client, /startEditor/);
  assert.match(client, /mergePdfIntoEditor/);
  assert.match(client, /delete_page/);
  assert.match(client, /reorder_page/);
  assert.match(client, /rotate_page/);
  assert.match(client, /merge_pdf/);
  assert.match(client, /pdf_edit_completed/);
  assert.doesNotMatch(client, /drive_sync_started|drive_sync_completed|replace_pdf|save_copy/);

  assert.match(editor, /removePage/);
  assert.match(editor, /movePage/);
  assert.match(editor, /movePageTo/);
  assert.match(editor, /rotatePage/);
  assert.match(editor, /duplicatePage/);
  assert.match(editor, /addBlankPage/);
  assert.match(editor, /undo/);
  assert.match(editor, /redo/);
  assert.match(editor, /addDocument/);
  assert.match(editor, /buildBlob/);
  assert.match(editor, /session\.plan\.length <= 1/);
});

test('permissão de edição é explícita e não é herdada automaticamente de Regulador(a)', () => {
  const html = read('admin/usuarios/index.html');
  const client = read('js/admin-users.js');

  assert.match(html, /editDocumentPdfPermission/);
  assert.match(html, /Permitir editor de PDF/);
  assert.match(html, /salvar no Drive continua indisponível nesta fase/);
  assert.match(client, /documentCapabilities\?\.edit/);
  assert.match(client, /\/api\/documents\/admin\/access\//);
  assert.match(client, /edit: regulatorEnabled === true && allowEdit === true/);
  assert.match(client, /editAdditionalRoleDocuments\.checked/);
  assert.doesNotMatch(client, /additionalRoles.*edit:\s*true/);
});


test('rebuild do editor prioriza o estado vivo atual antes do snapshot salvo', () => {
  const client = read('js/documents.js');
  assert.ok(client.includes('const viewState = initialViewState || currentViewerState() || state.editorViewState;'));
  assert.ok(!client.includes('const viewState = initialViewState || state.editorViewState || currentViewerState();'));
});


test('Editor UX V2 usa grade contextual sem botões globais redundantes de mover/rodar/eliminar', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const viewer = read('js/document-viewer.js');
  const css = read('css/documents.css');

  assert.match(html, /id="editorRailEditButton"/);
  assert.match(html, /id="editorOrganizeButton"/);
  assert.match(html, /id="editorBlankPageButton"/);
  assert.doesNotMatch(html, />\s*(?:Mover|Rodar|Eliminar)\s*<\/button>/i);
  assert.match(viewer, /action: 'rotate-left'/);
  assert.match(viewer, /action: 'rotate-right'/);
  assert.match(viewer, /action: 'duplicate'/);
  assert.match(viewer, /action: 'delete'/);
  assert.match(client, /operation === 'rotate-left'/);
  assert.match(client, /operation === 'rotate-right'/);
  assert.match(client, /operation === 'duplicate'/);
  assert.match(css, /data-organizer-mode="true"/);
  assert.match(css, /grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(205px,\s*1fr\)\)/);
  assert.match(css, /\.portal-pdf-drag-ghost/);
});


test('paleta do editor é vinculada à conta e não contém conteúdo documental', () => {
  const client = read('js/documents.js');
  const router = read('worker/documents-router.js');

  assert.match(client, /\/api\/documents\/preferences/);
  assert.match(client, /editorColorPalette/);
  assert.match(client, /onColorPaletteChange/);
  assert.match(router, /auth_document_editor_preferences/);
  assert.match(router, /color_palette_json/);
  assert.match(router, /DOCUMENTS_EDITOR_PALETTE_INVALID/);
  assert.doesNotMatch(router, /patient_name|cpf|cns|diagnostico|cid/i);
});

test('seletor de cor do toolbar faz preview sem poluir o histórico e consolida no change', () => {
  const client = read('js/documents.js');

  assert.match(client, /editorColorGesture/);
  assert.match(client, /function previewSelectedEditorColor/);
  assert.match(client, /updateObject\(session, object\.id, \{ color \}, \{ commit: false \}\)/);
  assert.match(client, /function commitEditorColorGesture/);
  assert.match(client, /commitObjectMutation\(session\)/);
  assert.match(client, /editorObjectColor\?\.addEventListener\('input', \(\) => previewSelectedEditorColor/);
  assert.match(client, /editorObjectColor\?\.addEventListener\('change', \(\) => finalizeSelectedEditorColor/);
});

test('paleta serializa gravações e a saída limpa o object mode antes de descartar a sessão', () => {
  const client = read('js/documents.js');

  assert.match(client, /editorPaletteWriteChain:\s*Promise\.resolve\(\)/);
  assert.match(client, /state\.editorPaletteWriteChain\.then\(write, write\)/);
  assert.match(client, /generation === state\.editorPaletteWriteGeneration/);
  assert.match(client, /setEditorObjects\?\.\(\[\], \{ mode: 'none', selectedObjectId: '' \}\)/);
});

test('paleta contextual cria slot e usa painel RGB próprio arrastável', () => {
  const viewer = read('js/document-viewer.js');
  const css = read('css/documents.css');

  assert.match(viewer, /session\.paletteSelectedIndex = session\.colorPalette\.length - 1/);
  assert.match(viewer, /session\.onColorPaletteChange\?\.\(\[\.\.\.session\.colorPalette\]\)/);
  assert.match(viewer, /data-text-custom-color-panel/);
  assert.match(viewer, /dataset\.colorDragHandle = 'true'/);
  assert.match(viewer, /rgbToHsv/);
  assert.match(viewer, /hsvToRgb/);
  assert.doesNotMatch(viewer, /showPicker\(\)/);
  assert.doesNotMatch(viewer, /data-text-palette-custom-picker/);
  assert.match(css, /\.portal-pdf-custom-color-panel[\s\S]*bottom:\s*calc\(100% \+ 8px\)/);
  assert.match(css, /\.portal-pdf-custom-color-drag[\s\S]*cursor:\s*move/);
});

test('transparência afeta somente o conteúdo e mantém controles opacos', () => {
  const viewer = read('js/document-viewer.js');
  const css = read('css/documents.css');

  assert.match(viewer, /--object-opacity/);
  assert.doesNotMatch(viewer, /element\.style\.opacity = String\(clamp01\(object\.opacity/);
  assert.match(css, /\.portal-pdf-object-text[\s\S]*opacity:\s*var\(--object-opacity, 1\)/);
  assert.match(css, /\.portal-pdf-object-image[\s\S]*opacity:\s*var\(--object-opacity, 1\)/);
});

test('3C.3 mantém objetos locais reversíveis e deixa Recortar/Desenhar bloqueados', () => {
  const html = read('documentos/index.html');
  const editor = read('js/document-editor.js');
  const viewer = read('js/document-viewer.js');
  const css = read('css/documents.css');

  assert.match(html, /id="editorCropButton"[^>]*disabled/);
  assert.match(html, /id="editorDrawButton"[^>]*disabled/);
  assert.match(html, /id="editorOverlayImageInput"[^>]*type="file"/);
  assert.match(editor, /objects:\s*\[\]/);
  assert.match(editor, /pageId:/);
  assert.match(editor, /commitObjectMutation/);
  assert.match(viewer, /data-object-resize/);
  assert.match(viewer, /data-object-rotate/);
  assert.match(viewer, /handle === 'se' \? 'transform' : 'resize'/);
  assert.match(viewer, /distance \/ drag\.startDistance/);
  assert.match(viewer, /rotation: drag\.start\.rotation \+ \(angle - drag\.startAngle\)/);
  assert.match(viewer, /contentEditable/);
  assert.match(viewer, /suppressCreateTextUntil/);
  assert.match(viewer, /finishTextEditing/);
  assert.match(viewer, /edit-move-pending/);
  assert.match(viewer, /data-text-quickbar/);
  assert.match(viewer, /data-text-palette-index/);
  assert.match(viewer, /onColorPaletteChange/);
  assert.match(viewer, /objectMode[^\n]+!== 'write'/);
  assert.match(viewer, /clearSelectedObject/);
  assert.match(viewer, /hasOwnProperty\.call\(options, 'selectedObjectId'\)/);
  assert.match(css, /\.portal-pdf-object-layer/);
  assert.match(css, /\.portal-pdf-object-handle--se/);
  assert.match(css, /\.portal-pdf-object-rotate/);
  assert.match(css, /\.portal-pdf-text-quickbar/);
  assert.match(css, /\.portal-pdf-text-palette/);
});