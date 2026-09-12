import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Central usa somente Worker para Drive e delega persistência documental ao cache criptografado', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');

  assert.match(html, /frame-src 'self' blob:/);
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
  assert.match(source, /CACHE_VERSION = '20260912-13'/);
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

  assert.match(html, /documents\.js\?v=20260912-4/);
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
  assert.match(client, /'hit', false, 'cache'/);
  assert.match(client, /source: 'cache'|source,?/);
});


test('cabeçalho do visualizador preserva ações e trunca somente o título do PDF', () => {
  const html = read('documentos/index.html');
  const css = read('css/documents.css');

  assert.match(html, /documents\.css\?v=20260912-4/);
  assert.match(html, /id="editPdfButton"[^>]*>Editar PDF<\/button>/);
  assert.match(css, /\.documents-viewer-head > div:first-child\s*\{[^}]*min-width:\s*0;[^}]*flex:\s*1 1 auto;/s);
  assert.match(css, /\.documents-viewer-actions\s*\{[^}]*flex:\s*0 0 auto;/s);
  assert.match(css, /\.documents-viewer-head strong\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*100%;[^}]*text-overflow:\s*ellipsis;/s);
  assert.doesNotMatch(css, /\.documents-viewer-head strong\s*\{[^}]*max-width:\s*min\(54vw,\s*640px\)/s);
});

test('editor expõe união de outro PDF e sincroniza ações da lista', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');

  assert.match(html, /id="editorMergeButton"[^>]*>Unir outro PDF<\/button>/);
  assert.match(client, /editorMerge:\s*document\.getElementById\('editorMergeButton'\)/);
  assert.match(client, /function refreshPdfListActions\(\)/);
  assert.match(client, /'Unir ao editor'/);
  assert.match(client, /'Já no editor'/);
  assert.match(client, /function choosePdfToMerge\(\)/);
  assert.match(client, /els\.editorMerge\.addEventListener\('click', choosePdfToMerge\)/);
  assert.match(client, /mergePdfIntoEditor\(item\)/);
});

test('editor aceita imagens e Ctrl+V como novas páginas', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const editor = read('js/document-editor.js');
  const observability = read('js/portal-observability.js');

  assert.match(html, /id="editorImageButton"[^>]*>Adicionar imagem<\/button>/);
  assert.match(html, /Ctrl\+V/);
  assert.match(html, /document-editor\.js\?v=20260912-2/);
  assert.match(html, /documents\.js\?v=20260912-4/);
  assert.match(client, /handleEditorPaste/);
  assert.match(client, /clipboardData/);
  assert.match(client, /addImageBlobToEditor/);
  assert.match(client, /addImagePage/);
  assert.match(editor, /async function addImagePage/);
  assert.match(editor, /embedPng/);
  assert.match(editor, /embedJpg/);
  assert.match(observability, /'insert_image'/);
});

test('editor PDF é local, reversível e separado da escrita no Drive', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');
  const editor = read('js/document-editor.js');

  assert.match(html, /document-editor\.js\?v=20260912-1/);
  assert.match(html, /Editar PDF/);
  assert.match(html, /As alterações ainda não serão salvas no Google Drive/);
  assert.match(html, /cdn\.jsdelivr\.net/);

  assert.match(client, /canEditDocuments/);
  assert.match(client, /caps\.edit === true/);
  assert.match(client, /startEditor/);
  assert.match(client, /mergePdfIntoEditor/);
  assert.match(client, /delete_page/);
  assert.match(client, /reorder_page/);
  assert.match(client, /merge_pdf/);
  assert.match(client, /pdf_edit_completed/);
  assert.doesNotMatch(client, /drive_sync_started|drive_sync_completed|replace_pdf|save_copy/);

  assert.match(editor, /removePage/);
  assert.match(editor, /movePage/);
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
