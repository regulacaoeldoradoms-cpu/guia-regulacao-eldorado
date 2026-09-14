import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '../..');
const source = fs.readFileSync(path.join(root, 'js/document-editor.js'), 'utf8');

function editorWithFakePdfLib() {
  const fakePdfLib = {
    PDFDocument: {
      async load(bytes) {
        const pageCount = Math.max(1, Number(bytes?.[0] || 1));
        return {
          pageCount,
          getPageCount() { return this.pageCount; }
        };
      },
      async create() {
        const pages = [];
        return {
          async copyPages(sourceDocument, indices) {
            return indices.map((pageIndex) => ({ sourceDocument, pageIndex }));
          },
          async embedPng() {
            return { scale: () => ({ width: 1200, height: 600 }) };
          },
          async embedJpg() {
            return { scale: () => ({ width: 600, height: 1200 }) };
          },
          addPage(page) {
            const created = {
              size: Array.isArray(page) ? page : null,
              drawImage() {}
            };
            pages.push(page);
            return created;
          },
          async save() {
            return new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55, 10, pages.length]);
          }
        };
      }
    }
  };

  const context = {
    window: { PDFLib: fakePdfLib },
    document: {},
    Blob,
    Uint8Array,
    performance: { now: () => 1 },
    console
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.window.PortalPdfEditor;
}

test('editor usa pdf-lib self-hosted com SRI e sem carregamento remoto', () => {
  assert.match(source, /LIB_URL = '\/vendor\/pdf-lib\/pdf-lib\.min\.js'/);
  assert.match(source, /sha512-z8IYLHO8bTgFqj\+yrPyIJnzBDf7DDhWwiEsk4sY\+Oe6J2M\+WQequeGS7qioI5vT6rXgVRb4K1UVQC5ER7MKzKQ==/);
  assert.match(source, /crossOrigin = 'anonymous'/);
  assert.match(source, /referrerPolicy = 'no-referrer'/);
  assert.doesNotMatch(source, /https?:\/\//);
  assert.ok(fs.statSync(path.join(root, 'vendor/pdf-lib/pdf-lib.min.js')).size > 100_000);
});

test('excluir e reordenar páginas são reversíveis e não permitem remover a última página', async () => {
  const editor = editorWithFakePdfLib();
  const session = await editor.createSession(new Blob([new Uint8Array([3])], { type: 'application/pdf' }), { label: 'Documento inicial' });

  assert.equal(editor.pageCount(session), 3);
  assert.equal(editor.movePage(session, 2, -1), true);
  assert.deepEqual(
    Array.from(editor.pageModel(session), (page) => Number(page.sourcePage)),
    [1, 3, 2]
  );

  assert.equal(editor.removePage(session, 0), true);
  assert.equal(editor.pageCount(session), 2);
  assert.equal(editor.canUndo(session), true);

  assert.equal(editor.undo(session), true);
  assert.equal(editor.pageCount(session), 3);
  assert.deepEqual(Array.from(editor.pageModel(session), (page) => Number(page.sourcePage)), [1, 3, 2]);

  assert.equal(editor.undo(session), true);
  assert.deepEqual(Array.from(editor.pageModel(session), (page) => Number(page.sourcePage)), [1, 2, 3]);
  assert.equal(editor.canRedo(session), true);

  assert.equal(editor.redo(session), true);
  assert.deepEqual(Array.from(editor.pageModel(session), (page) => Number(page.sourcePage)), [1, 3, 2]);

  const single = await editor.createSession(new Blob([new Uint8Array([1])], { type: 'application/pdf' }));
  assert.equal(editor.removePage(single, 0), false);
  assert.equal(editor.pageCount(single), 1);
});

test('união adiciona páginas ao plano e gera Blob PDF local válido', async () => {
  const editor = editorWithFakePdfLib();
  const session = await editor.createSession(new Blob([new Uint8Array([2])], { type: 'application/pdf' }), { label: 'Documento inicial' });

  const added = await editor.addDocument(
    session,
    new Blob([new Uint8Array([3])], { type: 'application/pdf' }),
    { label: 'Documento 2' }
  );

  assert.equal(added, 3);
  assert.equal(editor.sourceCount(session), 2);
  assert.equal(editor.pageCount(session), 5);
  assert.deepEqual(
    Array.from(editor.pageModel(session), (page) => [Number(page.sourceIndex), Number(page.sourcePage)]),
    [[0, 1], [0, 2], [1, 1], [1, 2], [1, 3]]
  );

  const output = await editor.buildBlob(session);
  assert.equal(output.type, 'application/pdf');
  const header = new Uint8Array(await output.arrayBuffer()).slice(0, 4);
  assert.equal(String.fromCharCode(...header), '%PDF');

  assert.equal(editor.undo(session), true);
  assert.equal(editor.pageCount(session), 2);
  assert.equal(editor.redo(session), true);
  assert.equal(editor.pageCount(session), 5);
});

test('imagem entra na posição pedida e permanece identificável na ordem visual', async () => {
  const editor = editorWithFakePdfLib();
  const session = await editor.createSession(
    new Blob([new Uint8Array([3])], { type: 'application/pdf' }),
    { label: 'Documento inicial' }
  );

  const insertedAt = await editor.addImagePage(
    session,
    new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' }),
    { label: 'Imagem sintética', insertAt: 1 }
  );

  assert.equal(insertedAt, 1);
  assert.equal(editor.pageCount(session), 4);
  assert.deepEqual(
    Array.from(editor.pageModel(session), (page) => [page.sourceKind, page.sourceLabel, Number(page.sourcePage)]),
    [
      ['pdf', 'Documento inicial', 1],
      ['image', 'Imagem sintética', 1],
      ['pdf', 'Documento inicial', 2],
      ['pdf', 'Documento inicial', 3]
    ]
  );

  assert.equal(editor.undo(session), true);
  assert.equal(editor.pageCount(session), 3);
  assert.equal(editor.redo(session), true);
  assert.equal(editor.pageCount(session), 4);

  const output = await editor.buildBlob(session);
  assert.equal(output.type, 'application/pdf');
});
