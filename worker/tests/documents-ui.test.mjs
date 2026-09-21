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
  for (const method of ['open', 'close', 'getViewState', 'getPageCount', 'setThumbnailActions', 'setOrganizerMode', 'setEditorObjects', 'scrollToPage', 'zoomIn', 'zoomOut', 'fitWidth']) {
    assert.equal(typeof sandbox.window.PortalPdfViewer[method], 'function', `API pública: ${method}`);
  }
  assert.match(viewer, /session\.root\.dataset\.organizerMode = next \? 'true' : 'false'/);
});

test('visualizador inicia em 114% sem impedir Ajustar largura', () => {
  const viewer = read('js/document-viewer.js');
  assert.match(viewer, /const DEFAULT_INITIAL_SCALE = 1\.14/);
  assert.match(viewer, /Math\.min\(DEFAULT_INITIAL_SCALE, fitScale\)/);
  assert.match(viewer, /const preserveFitScale = initialViewState\?\.fitMode === true/);
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
  assert.match(source, /CACHE_VERSION = '20260917-2'/);
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

  assert.match(html, /documents\.js\?v=20260921-5/);
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

  assert.match(html, /documents\.css\?v=20260921-6/);
  assert.match(html, /id="editPdfButton"[^>]*>Editar PDF<\/button>/);
  assert.match(css, /\.documents-viewer-head > div:first-child\s*\{[^}]*min-width:\s*0;[^}]*flex:\s*1 1 auto;/s);
  assert.match(css, /\.documents-viewer-actions\s*\{[^}]*flex:\s*0 0 auto;/s);
  assert.match(css, /\.documents-viewer-head #documentsViewerTitle\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*100%;[^}]*text-overflow:\s*ellipsis;/s);
  assert.doesNotMatch(css, /\.documents-viewer-head #documentsViewerTitle\s*\{[^}]*max-width:\s*min\(54vw,\s*640px\)/s);
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
  assert.match(html, /document-viewer\.js\?v=20260921-1/);
  assert.match(html, /documents\.js\?v=20260921-5/);
  assert.match(html, /documents\.css\?v=20260921-6/);

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
  const printStart = client.indexOf('  function ensurePrintFrame()');
  const printEnd = client.indexOf('  async function startEditor()', printStart);
  assert.ok(printStart >= 0 && printEnd > printStart, 'Bloco de impressão local deve existir.');
  const printBlock = client.slice(printStart, printEnd);
  const clientWithoutPrintBlock = client.slice(0, printStart) + client.slice(printEnd);
  assert.doesNotMatch(clientWithoutPrintBlock, /showIframeViewerSurface|documentsPdfFrame|els\.frame|createElement\(['"](?:iframe|embed|object)['"]\)/i);
  assert.match(printBlock, /createElement\(['"]iframe['"]\)/);
  assert.match(printBlock, /documents-print-frame/);
  assert.doesNotMatch(printBlock, /\.src\s*=|location\.replace\(|URL\.createObjectURL\(/);
  assert.doesNotMatch(viewer, /createElement\(['"](?:iframe|embed|object)['"]\)/i);
  assert.match(client, /registerProgressiveStream/);
  assert.match(client, /pdf_first_page_visible/);
  assert.match(client, /pdfReadyEmitted/);
});

test('Titon permite selecionar e copiar texto nativo do PDF sem interferir nas ferramentas do editor', () => {
  const viewer = read('js/document-viewer.js');
  const css = read('css/documents.css');

  assert.match(viewer, /className = 'portal-pdf-text-layer'/);
  assert.match(viewer, /session\.pdfjs\?\.TextLayer/);
  assert.match(viewer, /page\.streamTextContent\(\{ includeMarkedContent: true, disableNormalization: false \}\)/);
  assert.match(viewer, /new TextLayer\(\{[\s\S]*textContentSource,[\s\S]*container: layerNode,[\s\S]*viewport/);
  assert.match(viewer, /--scale-factor/);
  assert.match(viewer, /--total-scale-factor/);
  assert.match(viewer, /renderSelectableTextLayer\(session, record, page, viewport, generation\)/);
  assert.match(viewer, /clearSelectableTextLayer\(record\)/);
  assert.match(viewer, /\[record\.canvas, record\.textLayer, record\.drawLayer, record\.objectLayer\]/);

  assert.match(css, /\.portal-pdf-text-layer\s*\{[\s\S]*user-select:\s*text;[\s\S]*pointer-events:\s*auto;/);
  assert.match(css, /\.portal-pdf-text-layer ::selection/);
  assert.match(css, /data-main-rotation="90"/);
  assert.match(css, /data-main-rotation="180"/);
  assert.match(css, /data-main-rotation="270"/);
  assert.match(css, /data-object-mode="write"[\s\S]*\.portal-pdf-text-layer/);
  assert.match(css, /data-draw-mode="draw"[\s\S]*\.portal-pdf-text-layer/);
  assert.match(css, /data-crop-mode="crop"[\s\S]*\.portal-pdf-text-layer/);
  assert.match(css, /pointer-events:\s*none;[\s\S]*user-select:\s*none;/);
});

test('observadores entram somente depois da primeira renderização do PDF.js', () => {
  const viewer = read('js/document-viewer.js');
  const firstRender = viewer.indexOf('await Promise.all([');
  const observers = viewer.indexOf('installObservers(session);', firstRender);
  assert.ok(firstRender >= 0);
  assert.ok(observers > firstRender);
  assert.match(viewer, /if \(!force && sameRender\) \{\s*await settleRenderTask\(record\);\s*return;/s);
});


test('kit visual do editor usa assets individuais self-hosted e preserva acessibilidade textual', () => {
  const html = read('documentos/index.html');
  const css = read('css/documents.css');
  const harness = read('testing/central-docs/viewer-harness.html');

  for (const asset of [
    'zoom-menos.svg',
    'zoom-mais.svg',
    'ajustar-largura.svg',
    'grade-ativa.svg',
    'grade-inativa.svg',
    'salvar-pdf.svg',
    'imprimir-normal.svg',
    'fechar.svg',
    'cancelar.svg'
  ]) {
    assert.ok(fs.existsSync(path.join(root, 'assets/editor-pdf-buttons', asset)), asset);
  }
  for (const asset of [
    'Unir_PDF.png',
    'Inserir_pagina_branca.png',
    'Adicionar_imagem.png',
    'Recortar_pagina.png',
    'Selecionar_mover.png',
    'Escrever.png',
    'Colar_imagem.png',
    'Desenhar.png'
  ]) {
    assert.ok(fs.existsSync(path.join(root, 'assets', asset)), asset);
  }
  assert.match(html, /id="pdfZoomOutButton"[^>]*documents-art-zoom-minus/);
  assert.match(html, /id="pdfZoomInButton"[^>]*documents-art-zoom-plus/);
  assert.match(html, /id="pdfFitWidthButton"[^>]*documents-art-fit-width[^>]*aria-label="Ajustar largura"/);
  assert.match(html, /id="editorOrganizeButton"[^>]*documents-art-grid/);
  assert.match(html, /documents-tool-icon-merge[^>]*id="editorMergeButton"/);
  assert.match(html, /documents-tool-icon-blank[^>]*id="editorBlankPageButton"/);
  assert.match(html, /documents-tool-icon-add-image[^>]*id="editorImageButton"/);
  assert.match(html, /documents-tool-icon-crop[^>]*id="editorCropButton"/);
  assert.match(html, /documents-tool-icon-select[^>]*id="editorSelectButton"/);
  assert.match(html, /documents-tool-icon-write[^>]*id="editorWriteButton"/);
  assert.match(html, /documents-tool-icon-paste-image[^>]*id="editorOverlayImageButton"/);
  assert.match(html, /documents-tool-icon-draw[^>]*id="editorDrawButton"/);
  assert.doesNotMatch(html, /id="editorPreviewButton"/);
  assert.match(html, /id="editorExportButton"[^>]*documents-art-export[^>]*aria-label="Exportar PDF final localmente"/);
  assert.match(html, /id="editorPrintButton"[^>]*documents-art-print[^>]*aria-label="Imprimir PDF final"/);
  assert.match(html, /id="editorExitButton"[^>]*documents-art-close/);
  assert.match(harness, /id="editorPrint"[^>]*documents-art-print/);
  assert.match(css, /editor-pdf-buttons\/zoom-menos\.svg/);
  assert.match(css, /editor-pdf-buttons\/salvar-pdf\.svg/);
  assert.match(css, /editor-pdf-buttons\/imprimir-normal\.svg/);
  assert.match(css, /editor-pdf-buttons\/grade-ativa\.svg/);
  assert.match(css, /assets\/Unir_PDF\.png/);
  assert.match(css, /assets\/Inserir_pagina_branca\.png/);
  assert.match(css, /assets\/Adicionar_imagem\.png/);
  assert.match(css, /assets\/Recortar_pagina\.png/);
  assert.match(css, /assets\/Selecionar_mover\.png/);
  assert.match(css, /assets\/Escrever\.png/);
  assert.match(css, /assets\/Colar_imagem\.png/);
  assert.match(css, /assets\/Desenhar\.png/);
  assert.doesNotMatch(css, /documents-art-refresh/);
  assert.doesNotMatch(css, /--documents-art-sheet/);
  assert.doesNotMatch(css, /Bot%C3%B5es_Editor_PDF\.png/);
  assert.match(css, /documents-art-print:hover/);
  assert.match(css, /documents-art-print:active/);
  assert.match(css, /portal-pdf-crop-action--cancel/);
});

test('editor usa os controles da mesma superfície PDF.js sem lista textual paralela', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const viewer = read('js/document-viewer.js');
  const editor = read('js/document-editor.js');
  const css = read('css/documents.css');
  const harness = read('testing/central-docs/editor-harness.js');
  const viewerSurface = elementSourceById(html, 'documentsCustomViewer');

  assert.match(viewerSurface, /id="documentsEditor"/);
  assert.match(viewerSurface, /id="editorUndoButton"/);
  assert.match(viewerSurface, /id="editorRedoButton"/);
  assert.match(viewerSurface, /id="editorMergeButton"/);
  assert.match(viewerSurface, /id="editorOrganizeButton"/);
  assert.match(viewerSurface, /id="editorBlankPageButton"/);
  assert.match(viewerSurface, /id="editorMergePanel"/);
  assert.match(viewerSurface, /id="editorImageButton"/);
  assert.match(viewerSurface, /id="editorCropButton"/);
  assert.doesNotMatch(viewerSurface, /id="editorCropButton"[^>]*disabled/);
  assert.match(viewerSurface, /id="editorSelectButton"/);
  assert.match(viewerSurface, /id="editorWriteButton"/);
  assert.doesNotMatch(viewerSurface, /id="editorWriteButton"[^>]*disabled/);
  assert.match(viewerSurface, /id="editorOverlayImageButton"/);
  assert.doesNotMatch(viewerSurface, /id="editorOverlayImageButton"[^>]*disabled/);
  assert.match(viewerSurface, /id="editorDrawButton"/);
  assert.doesNotMatch(viewerSurface, /id="editorDrawButton"[^>]*disabled/);
  assert.match(viewerSurface, /id="editorDrawToolbar"/);
  assert.match(viewerSurface, /id="editorDrawColor"/);
  assert.match(viewerSurface, /id="editorDrawWidth"/);
  assert.match(viewerSurface, /id="editorDrawPen"/);
  assert.match(viewerSurface, /id="editorDrawEraser"/);
  assert.match(viewerSurface, /id="editorPrintButton"/);
  assert.match(viewerSurface, /id="editorExitButton"/);
  assert.match(viewerSurface, /id="pdfThumbnailRail"/);
  assert.match(viewerSurface, /id="pdfPageScroll"/);
  assert.doesNotMatch(html, /id="documentsEditorPages"/);
  assert.doesNotMatch(client, /documentsEditorPages|data-editor-index|renderEditorPages/);
  assert.match(html, /document-viewer\.js\?v=20260921-1/);
  assert.match(html, /documents\.js\?v=20260921-5/);
  assert.match(html, /documents\.css\?v=20260921-6/);

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
  assert.match(viewer, /getPageCount,/);
  assert.match(viewer, /setThumbnailActions,/);
  assert.match(viewer, /dataset\.thumbnailAction/);
  assert.match(viewer, /portal-pdf-thumb-actions/);

  assert.match(css, /\.portal-pdf-thumb-actions/);
  assert.match(css, /\.portal-pdf-thumb-action\.danger/);
  assert.match(client, /function startCropPages\(/);
  assert.match(client, /state\.editorMode === 'crop'/);
  assert.match(client, /async function printEditedPdfLocal\(/);
  assert.match(client, /async function renderPdfBlobForPrint\(/);
  assert.match(client, /function ensurePrintFrame\(/);
  assert.doesNotMatch(client, /window\.open\(/);
  assert.doesNotMatch(client, /printWindow\.location\.replace\(/);
  assert.match(client, /finalPdfCacheRevision/);
  assert.match(client, /Promise\.all\(Array\.from\(\{ length: concurrency \}/);
  assert.match(harness, /async function renderPdfBlobForPrint\(/);
  assert.match(harness, /function ensurePrintFrame\(/);
  assert.doesNotMatch(harness, /window\.open\(|location\.replace\(/i);
  assert.match(client, /primary && key === 'z'/);
  assert.match(client, /primary && key === 'p'/);
  assert.match(css, /\.documents-editor-field\[hidden\]/);
  assert.match(viewer, /function setEditorCrops\(/);
  assert.match(viewer, /data-crop-resize/);
  assert.match(editor, /function setPageCrop\(/);
  assert.match(editor, /function rotateCropRect\(/);
  assert.match(editor, /entry\.crop = rotateCropRect\(entry\.crop, turns\)/);
  assert.match(css, /\.portal-pdf-crop-layer/);
  assert.match(css, /\.portal-pdf-crop-frame/);
  assert.doesNotMatch(html, /<(?:iframe|embed|object)\b/i);
  const printStart2 = client.indexOf('  function ensurePrintFrame()');
  const printEnd2 = client.indexOf('  async function startEditor()', printStart2);
  const runtimeWithoutPrintFrame = client.slice(0, printStart2) + client.slice(printEnd2);
  assert.doesNotMatch(runtimeWithoutPrintFrame, /createElement\(['"](?:iframe|embed|object)['"]\)/i);
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
  assert.match(html, /id="editorMergeLocalButton"[^>]*>Adicionar PDF ou imagem<\/button>/);
  assert.match(html, /id="editorMergeLocalInput"[^>]*accept="\.pdf,application\/pdf,image\/\*"/);
  assert.match(client, /async function mergeLocalFilesIntoEditor\(/);
  assert.match(client, /normalizeImageForPdf\(file\)/);
  assert.match(client, /editor\.addDocument\(session, file/);
  assert.match(client, /editor\.addImagePage\(session, normalized/);
});

test('editor diferencia imagem como nova página de Colar imagem sobre página', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const editor = read('js/document-editor.js');
  const viewer = read('js/document-viewer.js');
  const observability = read('js/portal-observability.js');

  assert.match(html, /id="editorImageButton"[^>]*title="Adicionar imagem como nova página"/);
  assert.match(html, /id="editorImageInput"[^>]*type="file"[^>]*accept="image\/\*"/);
  assert.match(html, /id="editorOverlayImageButton"[^>]*title="Colar imagem sobre a página"/);
  assert.doesNotMatch(html, /id="editorOverlayImageButton"[^>]*disabled/);
  assert.match(html, /id="editorWriteButton"[^>]*title="Escrever sobre a página"/);
  assert.doesNotMatch(html, /id="editorWriteButton"[^>]*disabled/);
  assert.match(html, /id="editorSelectButton"/);
  assert.match(html, /id="editorObjectToolbar"/);
  assert.match(html, /document-editor\.js\?v=20260916-2/);
  assert.match(html, /documents\.js\?v=20260921-5/);
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

test('editor PDF sincroniza automaticamente apenas após alteração e mantém força manual como fallback', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const css = read('css/documents.css');
  const editor = read('js/document-editor.js');

  assert.match(html, /document-editor\.js\?v=20260916-2/);
  assert.match(html, /Editar PDF/);
  assert.match(html, /id="editorExitButton"/);
  assert.match(html, /id="editorSyncButton"[^>]*data-sync-state="normal"/);
  assert.match(html, /Forçar sincronização com Google Drive/);
  assert.match(html, /sincronizadas automaticamente/);
  assert.match(editor, /\/vendor\/pdf-lib\/pdf-lib\.min\.js/);
  assert.doesNotMatch(editor, /https?:\/\//);
  assert.doesNotMatch(html, /cdn\.jsdelivr\.net/);
  assert.ok(fs.statSync(path.join(root, 'vendor/pdf-lib/pdf-lib.min.js')).size > 100_000);

  assert.match(client, /canEditDocuments/);
  assert.match(client, /canSyncDocuments/);
  assert.match(client, /drive\.writeEnabled === true/);
  assert.match(client, /DRIVE_AUTO_SYNC_IDLE_MS = 1000/);
  assert.match(client, /DRIVE_SYNC_SUCCESS_VISIBLE_MS = 1000/);
  assert.match(client, /DRIVE_SYNC_REVISION_POLL_MS = 200/);
  assert.match(client, /scheduleAutomaticDriveSync/);
  assert.match(client, /driveSyncLastObservedRevision/);
  assert.match(client, /driveSyncLastConfirmedRevision/);
  assert.match(client, /forceDriveSync/);
  assert.match(client, /async function exitEditor/);
  assert.match(client, /Sincronizando alterações antes de fechar o editor/);
  assert.match(client, /O editor permanecerá aberto para evitar perder alterações/);
  assert.match(client, /window\.addEventListener\('beforeunload'/);
  assert.match(client, /currentEditorRevision\(\) !== state\.driveSyncLastConfirmedRevision/);
  assert.match(client, /operation: 'replace_pdf'/);
  assert.match(client, /preserveRevision/);
  assert.match(client, /safetyRevisionPreserved/);
  assert.match(client, /\/api\/documents\/drive\/sync\/preflight/);
  assert.match(client, /\/api\/documents\/drive\/sync\/start/);
  assert.match(client, /\/api\/documents\/drive\/sync\/upload\//);
  assert.match(client, /\/api\/documents\/drive\/sync\/status\//);
  assert.match(client, /drive_sync_started/);
  assert.match(client, /drive_sync_completed/);
  assert.match(client, /drive_sync_failed/);
  assert.match(client, /if \(!completed\?\.completed\)/);
  assert.match(client, /showDriveSyncSuccess/);
  assert.match(client, /setDriveSyncVisualState\('failed'\)/);
  assert.match(client, /Content-Range/);
  assert.match(client, /finalPdfBlobForSession/);

  for (const asset of [
    'Drive_normal.png',
    'Drive_pendente.png',
    'Drive_sincronizando.png',
    'Drive_sincronizado_1seg.png',
    'Drive_falha.png'
  ]) {
    assert.ok(fs.existsSync(path.join(root, 'assets', asset)), asset);
    assert.match(css, new RegExp('assets/' + asset.replace('.', '\\.') ));
  }

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
test('Fase 4C mantém telemetria de sincronização estritamente técnica e sucesso condicionado', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const observability = read('js/portal-observability.js');
  const serverObservability = read('worker/observability.js');

  assert.match(html, /id="editorSyncButton"/);
  assert.match(client, /drive\.writeEnabled === true/);
  assert.match(client, /if \(!completed\?\.completed\)/);
  assert.match(client, /applyConfirmedDriveSync\(operation, completed, blob, copyName\)/);
  assert.match(client, /currentEditorRevision\(\) === targetRevision/);
  assert.match(client, /setDriveSyncVisualState\('syncing'\)/);
  assert.match(client, /setDriveSyncVisualState\('success'\)/);
  assert.match(client, /setDriveSyncVisualState\('failed'\)/);

  for (const event of ['drive_sync_started', 'drive_sync_completed', 'drive_sync_failed']) {
    assert.match(client, new RegExp(`capture\\('${event}'`));
    assert.match(observability, new RegExp(`${event}: new Set`));
    assert.match(serverObservability, new RegExp(`${event}: new Set`));
  }

  const syncSection = client.slice(
    client.indexOf('async function syncEditedPdfToDrive'),
    client.indexOf('async function exportEditedPdfLocal')
  );
  const captureBodies = [...syncSection.matchAll(
    /capture\('(drive_sync_(?:started|completed|failed))',\s*\{([\s\S]*?)\}\);/g
  )];
  assert.equal(captureBodies.length, 3);
  for (const [, event, properties] of captureBodies) {
    assert.doesNotMatch(properties, /fileId|filename|item\.name|item\.ref|copyName|patient|cpf|cns|diagnostico|cid/i, event);
    assert.match(properties, /route:\s*'\/documentos\/'/);
    assert.match(properties, /operation/);
    assert.match(properties, /size_bucket/);
  }
  assert.match(captureBodies.find(([, event]) => event === 'drive_sync_failed')[2], /status_code/);
  assert.ok(syncSection.indexOf("if (!completed?.completed)") < syncSection.indexOf("setDriveSyncProgress('Salvo no Google Drive.'"));
  assert.ok(syncSection.indexOf("applyConfirmedDriveSync(operation, completed, blob, copyName)") < syncSection.lastIndexOf("showDriveSyncSuccess(targetRevision)"));
});


test('permissões de IA documental e edição são explícitas e não são herdadas automaticamente de Regulador(a)', () => {
  const html = read('admin/usuarios/index.html');
  const client = read('js/admin-users.js');

  assert.match(html, /editDocumentAiPermission/);
  assert.match(html, /Permitir IA documental/);
  assert.match(html, /proveniência por página/);
  assert.match(html, /editDocumentPdfPermission/);
  assert.match(html, /Permitir editor de PDF/);
  assert.match(html, /inclui sincronização segura com o Drive quando habilitada no ambiente/);
  assert.match(client, /documentCapabilities\?\.extract/);
  assert.match(client, /documentCapabilities\?\.edit/);
  assert.match(client, /\/api\/documents\/admin\/access\//);
  assert.match(client, /extract: regulatorEnabled === true && allowExtract === true/);
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
  const paletteStart = router.indexOf('function normalizeEditorColorPalette(');
  const paletteEnd = router.indexOf('function normalizeDocumentAiFieldOrder(', paletteStart);
  assert.ok(paletteStart >= 0 && paletteEnd > paletteStart, 'bloco da paleta não localizado');
  const paletteBlock = router.slice(paletteStart, paletteEnd);
  assert.doesNotMatch(paletteBlock, /patient_name|cpf|cns|diagnostico|cid/i);
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
  assert.match(viewer, /dataset\.colorPanelClose = 'true'/);
  assert.match(viewer, /rgbToHsv/);
  assert.match(viewer, /hsvToRgb/);
  assert.doesNotMatch(viewer, /showPicker\(\)/);
  assert.doesNotMatch(viewer, /data-text-palette-custom-picker/);
  assert.match(css, /\.portal-pdf-custom-color-panel[\s\S]*bottom:\s*calc\(100% \+ 8px\)/);
  assert.match(css, /\.portal-pdf-custom-color-drag[\s\S]*cursor:\s*move/);
});

test('arraste de objeto centraliza a caixa sob o ponteiro', () => {
  const viewer = read('js/document-viewer.js');
  assert.match(viewer, /\(\(event\.clientX - targetPage\.rect\.left\)[\s\S]{0,180}- \(width \/ 2\)/);
  assert.match(viewer, /\(\(event\.clientY - targetPage\.rect\.top\)[\s\S]{0,180}- \(height \/ 2\)/);
});

test('transparência afeta somente o conteúdo e mantém controles opacos', () => {
  const viewer = read('js/document-viewer.js');
  const css = read('css/documents.css');

  assert.match(viewer, /--object-opacity/);
  assert.doesNotMatch(viewer, /element\.style\.opacity = String\(clamp01\(object\.opacity/);
  assert.match(css, /\.portal-pdf-object-text[\s\S]*opacity:\s*var\(--object-opacity, 1\)/);
  assert.match(css, /\.portal-pdf-object-image[\s\S]*opacity:\s*var\(--object-opacity, 1\)/);
});

test('3C.5 mantém objetos/crop reversíveis e habilita Desenhar/Borracha vetorial', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const editor = read('js/document-editor.js');
  const viewer = read('js/document-viewer.js');
  const css = read('css/documents.css');

  assert.match(html, /id="editorCropButton"/);
  assert.doesNotMatch(html, /id="editorCropButton"[^>]*disabled/);
  assert.match(html, /id="editorDrawButton"/);
  assert.doesNotMatch(html, /id="editorDrawButton"[^>]*disabled/);
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
  assert.match(editor, /function setPageCrop\(/);
  assert.match(editor, /function clearPageCrop\(/);
  assert.match(editor, /function rotateCropRect\(/);
  assert.match(viewer, /function setEditorCrops\(/);
  assert.match(viewer, /data-crop-frame/);
  assert.match(viewer, /data-crop-resize/);
  assert.match(css, /\.portal-pdf-crop-layer/);
  assert.match(css, /\.portal-pdf-crop-frame/);
  assert.match(editor, /strokes:\s*\[\]/);
  assert.match(editor, /function addStroke\(/);
  assert.match(editor, /function removeStrokes\(/);
  assert.match(editor, /function strokeModel\(/);
  assert.match(viewer, /function setEditorStrokes\(/);
  assert.match(viewer, /portal-pdf-draw-layer/);
  assert.match(viewer, /onStrokeCommit/);
  assert.match(viewer, /onEraseCommit/);
  assert.match(client, /function startDrawMode\(/);
  assert.match(client, /state\.editorDrawTool/);
  assert.match(css, /\.portal-pdf-draw-layer/);
  assert.match(css, /\.documents-draw-toolbar/);

  // Review regressions: natural image ratio, rotated local-axis resize and
  // cancellation-safe color preview.
  assert.match(editor, /function displayPageAspectRatio\(/);
  assert.match(editor, /width \* \(pageAspectRatio > 0 \? pageAspectRatio : 1\) \/ aspectRatio/);
  assert.doesNotMatch(client, /addImageOverlay\([\s\S]{0,220}height:\s*\.22/);
  assert.match(viewer, /const localDx =/);
  assert.match(viewer, /const localDy =/);
  assert.match(viewer, /drag\.start\.width \+ localDx/);
  assert.match(viewer, /plane\.addEventListener\('pointercancel',[\s\S]{0,700}startColor[\s\S]{0,700}previewQuickbarColor/);
});

test('3C.6 mantém preview estrutural separado e exporta flatten somente para o dispositivo', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const editor = read('js/document-editor.js');

  assert.match(html, /id="editorExportButton"/);
  assert.match(html, /Exportar PDF final localmente/);
  assert.match(editor, /async function buildFlattenedBlob\(/);
  assert.match(editor, /function displayCartesianToPdf\(/);
  assert.match(editor, /setCropBox\?\.\(/);
  assert.match(editor, /page\.drawText\(/);
  assert.match(editor, /page\.drawImage\(/);
  assert.match(editor, /page\.drawLine\(/);
  assert.match(editor, /buildBlob,\s*buildFlattenedBlob,/s);
  assert.match(client, /async function exportEditedPdfLocal\(/);
  assert.match(client, /editor\.buildFlattenedBlob\(session\)/);
  assert.match(client, /URL\.createObjectURL\(blob\)/);
  assert.match(client, /link\.download = localEditedPdfName\(\)/);
  assert.match(client, /Nenhum arquivo foi enviado ao Google Drive/);

  const exportStart = client.indexOf('async function exportEditedPdfLocal');
  const exportEnd = client.indexOf('async function startEditor', exportStart);
  const exportBlock = client.slice(exportStart, exportEnd);
  assert.doesNotMatch(exportBlock, /auth\.api|capture\(|\/api\/documents|fetch\(/);
});



test('viewer expõe exportPageImage para isolamento da IA documental', () => {
  const viewer = read('js/document-viewer.js');
  assert.match(viewer, /async function exportPageImage\(pageNumber/);
  assert.match(viewer, /page\.render\(\{/);
  assert.match(viewer, /outputCanvas\.toBlob/);
  assert.match(viewer, /exportPageImage,/);
});

test('ferramentas laterais respeitam hidden mesmo com display autoral', () => {
  const html = read('documentos/index.html');
  const css = read('css/documents.css');

  assert.match(html, /id="documentAiButton"[^>]*hidden/);
  assert.match(css, /\.documents-rail-tool\[hidden\][\s\S]*display:\s*none\s*!important/);
  assert.match(css, /\.documents-editor-tool\[hidden\][\s\S]*display:\s*none\s*!important/);
  assert.match(html, /documents\.css\?v=20260921-6/);
});

test('lista ocupa toda a Central e Titon usa a mesma superfície em primeiro plano', () => {
  const html = read('documentos/index.html');
  const css = read('css/documents.css');
  const client = read('js/documents.js');

  assert.match(html, /id="documentsBrowser"/);
  assert.match(html, /id="documentsViewer"/);
  assert.match(css, /\.documents-workspace\s*\{[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /\.documents-browser,[\s\S]*\.documents-viewer\s*\{[\s\S]*grid-column:\s*1;[\s\S]*grid-row:\s*1;/);
  assert.match(css, /\.documents-workspace\.is-viewer-open:not\(\.is-browser-foreground\)[\s\S]*pointer-events:\s*none/);
  assert.match(client, /function syncWorkspaceLayers\(\)/);
  assert.match(client, /els\.browser\.inert = viewerOpen && !browserForeground/);
  const layerStart = client.indexOf('  function syncWorkspaceLayers()');
  const layerEnd = client.indexOf('  function selectListItem(', layerStart);
  const layerBlock = client.slice(layerStart, layerEnd);
  assert.doesNotMatch(layerBlock, /aria-hidden/);
  assert.match(client, /state\.browserForegroundReason = '';/);
  assert.match(client, /function focusSelectedListItem\(\)/);
});

test('desktop seleciona com clique e abre PDF por duplo clique ou Enter; mobile usa Abrir no Titon', () => {
  const html = read('documentos/index.html');
  const css = read('css/documents.css');
  const client = read('js/documents.js');

  assert.doesNotMatch(client, /'Duplo clique ou Enter'/);
  assert.match(client, /data-open-titon-index=/);
  assert.match(client, /els\.list\.addEventListener\('dblclick'/);
  assert.match(client, /els\.list\.addEventListener\('keydown',[\s\S]*event\.key !== 'Enter'/);
  assert.match(client, /selectListItem\(index\);[\s\S]*openPdf\(item\)/);
  assert.match(css, /\.documents-item-open-titon,\s*\n\.documents-item-open-folder\s*\{[\s\S]*display:\s*none/);
  assert.match(css, /@media \(max-width: 900px\), \(hover: none\) and \(pointer: coarse\)[\s\S]*\.documents-item-open-titon[\s\S]*display:\s*inline-flex/);
  assert.match(html, /documents\.css\?v=20260921-6/);
  assert.match(html, /documents\.js\?v=20260921-5/);
  assert.match(css, /\.documents-item\.selected\s*\{[^}]*background:\s*#fff3f0;[^}]*box-shadow:\s*inset 3px 0 0 #ff2800;/s);
  assert.match(css, /\.documents-item-icon\s*\{[^}]*background:\s*#fff0ed;[^}]*color:\s*#ff2800;/s);
  assert.match(css, /\.documents-item-action:empty\s*\{[^}]*display:\s*none;/s);
});

test('pastas seguem seleção por clique e abertura por duplo clique ou Enter', () => {
  const client = read('js/documents.js');
  const css = read('css/documents.css');

  const clickStart = client.indexOf("  els.list.addEventListener('click'");
  const dblStart = client.indexOf("  els.list.addEventListener('dblclick'", clickStart);
  const keyStart = client.indexOf("  els.list.addEventListener('keydown'", dblStart);
  assert.ok(clickStart >= 0 && dblStart > clickStart && keyStart > dblStart);

  const clickBlock = client.slice(clickStart, dblStart);
  assert.match(clickBlock, /if \(item\.isFolder\)\s*\{\s*selectListItem\(index\);\s*return;/s);
  const rowClickStart = clickBlock.indexOf("    const button = event.target.closest?.('[data-index]')");
  assert.ok(rowClickStart >= 0, 'handler do clique simples da linha ausente');
  const rowClickBlock = clickBlock.slice(rowClickStart);
  assert.doesNotMatch(rowClickBlock, /if \(item\.isFolder\)[\s\S]*state\.stack\.push/s);

  const dblBlock = client.slice(dblStart, keyStart);
  assert.match(dblBlock, /if \(item\.isFolder\)[\s\S]*state\.stack\.push\(\{ ref: item\.ref, name: item\.name \}\)[\s\S]*loadFolder\(\)/);

  const keyEnd = client.indexOf("  els.breadcrumbs.addEventListener", keyStart);
  const keyBlock = client.slice(keyStart, keyEnd);
  assert.match(keyBlock, /if \(item\.isFolder\)[\s\S]*loadFolder\(\)/);

  assert.doesNotMatch(client, /\? 'Abrir pasta'/);
  assert.match(client, /data-open-folder-index=/);
  assert.match(css, /\.documents-item-row\.folder/);
  assert.match(css, /\.documents-item-open-folder/);
});

test('unir PDF continua podendo escolher outro arquivo da Central com Titon em segundo plano', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');

  assert.match(html, /id="editorMergeBrowseButton"[^>]*>Escolher PDF da Central<\/button>/);
  assert.match(client, /editorMergeBrowse:\s*document\.getElementById\('editorMergeBrowseButton'\)/);
  assert.match(client, /function showMergeBrowserSelection\(\)/);
  assert.match(client, /state\.browserForegroundReason = 'merge'/);
  assert.match(client, /els\.editorMergeBrowse\?\.addEventListener\('click', showMergeBrowserSelection\)/);
  assert.match(client, /if \(state\.browserForegroundReason === 'merge'\)[\s\S]*syncWorkspaceLayers\(\)/);
});

test('Titon renomeia o PDF real no Drive com extensão protegida e confirmação explícita', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const router = read('worker/documents-router.js');
  const drive = read('worker/document-drive.js');
  const css = read('css/documents.css');

  assert.match(html, /id="documentsViewerTitle"[^>]*tabindex="0"[^>]*role="button"/);
  assert.match(html, /id="documentsViewerRenameInput"[^>]*maxlength="296"/);
  assert.ok(html.includes('documents-viewer-rename-extension" aria-hidden="true">.pdf</span>'));
  assert.match(html, /id="documentsViewerRenameStatus"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(client, /function selectViewerTitleText\(\)/);
  assert.match(client, /function beginPdfRename\(\)/);
  assert.match(client, /async function commitPdfRename\(\)/);
  assert.ok(client.includes('/api/documents/drive/rename'));
  assert.match(client, /baseVersion:\s*previous\.version/);
  assert.ok(client.includes("event.key === 'Enter'"));
  assert.ok(client.includes("event.key === 'Escape'"));
  assert.match(client, /viewerRenameInput\?\.addEventListener\('blur',[\s\S]*commitPdfRename\(\)/);
  assert.match(client, /Sincronizando nome com o Google Drive…/);
  assert.match(client, /Nome alterado e sincronizado com o Google Drive\./);
  assert.match(client, /Falha: o nome não foi alterado no Google Drive\./);
  assert.ok(router.includes("url.pathname === '/api/documents/drive/rename'"));
  assert.ok(router.includes("requireCapability(user, 'edit', origin)"));
  assert.match(drive, /export async function renameDrivePdf/);
  assert.match(drive, /method:\s*'PATCH'/);
  assert.ok(drive.includes('body: JSON.stringify({ name })'));
  assert.match(css, /#documentsViewerTitle\[hidden\][^}]*display:\s*none\s*!important/);
  assert.match(css, /\.documents-viewer-rename-status\.success/);
  assert.match(css, /\.documents-viewer-rename-status\.warning/);
});

test('zoom do Titon mantém porcentagem em tempo real legível sobre fundo claro', () => {
  const html = read('documentos/index.html');
  const css = read('css/documents.css');
  const viewer = read('js/document-viewer.js');

  assert.ok(html.includes('<span id="pdfZoomLabel">100%</span>'));
  assert.match(css, /#pdfZoomResetButton\s*\{[\s\S]*?color:\s*#111827\s*!important;[\s\S]*?background:\s*#fff;/);
  assert.match(css, /#pdfZoomResetButton #pdfZoomLabel\s*\{[\s\S]*?color:\s*#111827\s*!important;[\s\S]*?opacity:\s*1\s*!important;/);
  assert.ok(viewer.includes('zoomLabel.textContent = `${Math.round(session.scale * 100)}%`;'));
});

test('presença simultânea do Titon é efêmera, autenticada e não entra na observabilidade', () => {
  const html = read('documentos/index.html');
  const css = read('css/documents.css');
  const client = read('js/documents.js');
  const router = read('worker/documents-router.js');
  const presence = read('worker/document-presence.js');

  assert.match(html, /id="documentsPresenceNotice"[^>]*hidden/);
  assert.ok(html.includes('id="documentsPresenceText"'));
  assert.ok(css.includes('.documents-viewer.has-shared-presence'));
  assert.ok(css.includes('.documents-viewer.has-shared-editor'));
  assert.ok(client.includes('DOCUMENT_PRESENCE_HEARTBEAT_MS = 25_000'));
  assert.ok(client.includes('/api/documents/presence/heartbeat'));
  assert.ok(client.includes('/api/documents/presence'));
  assert.ok(client.includes("setDocumentPresenceMode('edit')"));
  assert.ok(client.includes("setDocumentPresenceMode('view')"));
  assert.ok(client.includes('Atenção para evitar uma solicitação duplicada'));
  assert.ok(router.includes("url.pathname === '/api/documents/presence/heartbeat'"));
  assert.ok(router.includes("mode === 'edit' && !hasDocumentCapability(user, 'edit')"));
  assert.ok(presence.includes('PRESENCE_TTL_SECONDS = 75'));
  assert.ok(presence.includes('drivePresenceKey(env, ref)'));
  assert.doesNotMatch(presence, /PostHog|capture\(|fileId|filename|item\.name/);
  const presenceStart = client.indexOf('  function clearDocumentPresenceVisual()');
  const presenceEnd = client.indexOf('  function documentAiCapabilities()', presenceStart);
  assert.ok(presenceStart >= 0 && presenceEnd > presenceStart);
  assert.doesNotMatch(client.slice(presenceStart, presenceEnd), /capture\(/);
});

test('Fase 6 carrega orquestrador de background antes do cliente documental', () => {
  const html = read('documentos/index.html');
  const backgroundIndex = html.indexOf('/js/document-background.js');
  const documentsIndex = html.indexOf('/js/documents.js');
  assert.ok(backgroundIndex >= 0);
  assert.ok(documentsIndex > backgroundIndex);
  assert.match(html, /id="documentsAutomationStatus"/);
});

test('6A orquestrador é idle, cancelável e com concorrência unitária', () => {
  const source = read('js/document-background.js');
  assert.match(source, /MAX_CONCURRENT = 1/);
  assert.match(source, /requestIdleCallback/);
  assert.match(source, /AbortController/);
  assert.match(source, /join/);
  assert.match(source, /cancelQueuedScope/);
  assert.match(source, /cancelScope/);
  assert.match(source, /cancelAll/);
  assert.match(source, /portal:session-cleared/);
  assert.match(source, /visibilitychange/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/);
});

test('6B prepara somente recursos efêmeros e reaproveita miniaturas lazy', () => {
  const client = read('js/documents.js');
  const viewer = read('js/document-viewer.js');
  assert.match(viewer, /async function prewarmThumbnails/);
  assert.match(viewer, /await renderThumbnail\(session, pageNumber\)/);
  assert.match(client, /scheduleActiveDocumentPreparation/);
  assert.match(client, /backgroundPreparedImages: new Map\(\)/);
  assert.match(client, /prepareDocumentAiPageBlob/);
  assert.match(client, /Math\.min\(2, pageCount\)/);
});

test('6C só antecipa IA com capability e gates corretos e reutiliza resultado na ação humana', () => {
  const client = read('js/documents.js');
  const readiness = client.slice(
    client.indexOf('  function documentAiBackgroundReady()'),
    client.indexOf('  async function prepareDocumentAiPageBlob')
  );
  assert.match(readiness, /processingEnabled === true/);
  assert.match(readiness, /features\?\.extractDocument === true/);
  assert.match(readiness, /features\?\.backgroundPreparation === true/);
  assert.match(readiness, /documentAiCapabilities\(\)\.extract === true/);
  assert.match(client, /backgroundPreparedAnalysis\.get\(pageNumber\)/);
  assert.match(client, /background\?\.join\?\.\(\`preextract:/);
  assert.match(client, /cancelQueuedScope\?\.\(state\.backgroundScope, 'foreground'\)/);
  assert.match(client, /background_state/);
  assert.doesNotMatch(readiness, /drive\/sync|replace_pdf|save_copy/);
});

test('6D aquece próximos PDFs apenas por sinais operacionais não clínicos', () => {
  const client = read('js/documents.js');
  const start = client.indexOf('  function scheduleLikelyPdfWarmup()');
  const end = client.indexOf('  function canEditDocuments()', start);
  const block = client.slice(start, end);
  assert.match(block, /backgroundRecentPdfs/);
  assert.match(block, /slice\(0, 3\)/);
  assert.match(block, /warmPdfCache/);
  assert.doesNotMatch(block, /cid|diagnostico|nome_paciente|cpf|cns|texto extraído|extraction\.fields/i);
});

test('6E sugestões permanecem informativas e nenhuma escrita é automática', () => {
  const client = read('js/documents.js');
  assert.match(client, /Titon preparou .*página\(s\).*segundo plano/);
  assert.match(client, /operation: 'suggestion'/);
  assert.match(client, /state: 'used'/);
  const backgroundSection = client.slice(
    client.indexOf('  function schedulePreparedPageAnalysis'),
    client.indexOf('  async function extractWholeDocumentAi')
  );
  assert.doesNotMatch(backgroundSection, /replace_pdf|save_copy|drive\/sync|delete_page/);
});

test('Fase 6 cancela background ao fechar PDF e preempta ao editar', () => {
  const client = read('js/documents.js');
  const close = client.slice(client.indexOf('  function closePdf()'), client.indexOf('  async function requestClosePdf'));
  const editor = client.slice(client.indexOf('  async function startEditor()'), client.indexOf('  async function normalizeImageForPdf'));
  assert.match(close, /resetDocumentBackgroundState\('document_changed'\)/);
  assert.match(editor, /cancelScope\?\.\(state\.backgroundScope, 'editor'\)/);
  assert.match(editor, /backgroundPreparedImages\.clear\(\)/);
  assert.match(editor, /backgroundPreparedAnalysis\.clear\(\)/);
  assert.match(editor, /pauseDocumentBackground\('editor'\)/);
});

