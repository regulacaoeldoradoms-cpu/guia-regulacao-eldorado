import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Central read-only usa somente Worker para Google Drive e não persiste conteúdo clínico no navegador', () => {
  const html = read('documentos/index.html');
  const client = read('js/documents.js');

  assert.match(html, /frame-src 'self' blob:/);
  assert.match(html, /Somente leitura/);
  assert.match(client, /\/api\/documents\/drive\/list/);
  assert.match(client, /\/api\/documents\/drive\/search/);
  assert.match(client, /\/api\/documents\/drive\/content\//);
  assert.doesNotMatch(client, /googleapis\.com|accounts\.google\.com/);
  assert.doesNotMatch(client, /localStorage|sessionStorage|indexedDB|caches\.open/);
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

test('service worker reconhece a página e fornece stream PDF efêmero sem cache persistente', () => {
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
  assert.match(source, /CACHE_VERSION = '20260911-11'/);
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

  assert.match(html, /documents\.js\?v=20260911-3/);
  assert.match(client, /registerProgressiveStream/);
  assert.match(client, /PORTAL_DOCUMENT_STREAM_REGISTER/);
  assert.match(client, /setInterval\(refreshProgressiveStream, 5000\)/);
  assert.match(client, /pdf_first_page_visible/);
  assert.match(client, /loadPdfBlobFallback/);
  assert.match(client, /URL\.createObjectURL/);
  assert.match(worker, /DOCUMENT_STREAM_TTL_MS = 20000/);
  assert.doesNotMatch(worker, /localStorage|sessionStorage|indexedDB/);
});
