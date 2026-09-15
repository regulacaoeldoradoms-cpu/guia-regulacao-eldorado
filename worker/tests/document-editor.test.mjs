import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '../..');
const source = fs.readFileSync(path.join(root, 'js/document-editor.js'), 'utf8');

function editorWithFakePdfLib() {
  const fakePdfLib = {
    degrees(angle) {
      return { angle: Number(angle || 0) };
    },
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
            return indices.map((pageIndex) => ({
              sourceDocument,
              pageIndex,
              rotation: 0,
              getRotation() { return { angle: this.rotation }; },
              setRotation(value) { this.rotation = Number(value?.angle || 0); }
            }));
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

test('arrastar para posição exata e girar página são reversíveis', async () => {
  const editor = editorWithFakePdfLib();
  const session = await editor.createSession(
    new Blob([new Uint8Array([4])], { type: 'application/pdf' }),
    { label: 'Documento inicial' }
  );

  assert.equal(editor.movePageTo(session, 0, 3), true);
  assert.deepEqual(Array.from(editor.pageModel(session), (page) => Number(page.sourcePage)), [2, 3, 4, 1]);

  assert.equal(editor.rotatePage(session, 1, 1), true);
  assert.equal(Number(editor.pageModel(session)[1].rotation), 90);

  assert.equal(editor.undo(session), true);
  assert.equal(Number(editor.pageModel(session)[1].rotation), 0);
  assert.equal(editor.undo(session), true);
  assert.deepEqual(Array.from(editor.pageModel(session), (page) => Number(page.sourcePage)), [1, 2, 3, 4]);

  assert.equal(editor.redo(session), true);
  assert.deepEqual(Array.from(editor.pageModel(session), (page) => Number(page.sourcePage)), [2, 3, 4, 1]);
  assert.equal(editor.redo(session), true);
  assert.equal(Number(editor.pageModel(session)[1].rotation), 90);

  const output = await editor.buildBlob(session);
  assert.equal(output.type, 'application/pdf');
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


test('união posicionada, duplicação e página em branco são reversíveis', async () => {
  const editor = editorWithFakePdfLib();
  const session = await editor.createSession(
    new Blob([new Uint8Array([3])], { type: 'application/pdf' }),
    { label: 'Documento inicial' }
  );

  const added = await editor.addDocument(
    session,
    new Blob([new Uint8Array([2])], { type: 'application/pdf' }),
    { label: 'Documento inserido', insertAt: 1 }
  );
  assert.equal(added, 2);
  assert.deepEqual(
    Array.from(editor.pageModel(session), (page) => [Number(page.sourceIndex), Number(page.sourcePage)]),
    [[0, 1], [1, 1], [1, 2], [0, 2], [0, 3]]
  );

  const duplicateAt = editor.duplicatePage(session, 1);
  assert.equal(duplicateAt, 2);
  assert.equal(editor.pageCount(session), 6);
  assert.deepEqual(
    Array.from(editor.pageModel(session).slice(1, 3), (page) => [Number(page.sourceIndex), Number(page.sourcePage)]),
    [[1, 1], [1, 1]]
  );

  const blankAt = await editor.addBlankPage(session, { insertAt: 3 });
  assert.equal(blankAt, 3);
  assert.equal(editor.pageModel(session)[3].sourceKind, 'blank');
  assert.equal(editor.pageCount(session), 7);

  assert.equal(editor.undo(session), true);
  assert.equal(editor.pageCount(session), 6);
  assert.equal(editor.undo(session), true);
  assert.equal(editor.pageCount(session), 5);
  assert.equal(editor.undo(session), true);
  assert.deepEqual(
    Array.from(editor.pageModel(session), (page) => [Number(page.sourceIndex), Number(page.sourcePage)]),
    [[0, 1], [0, 2], [0, 3]]
  );

  assert.equal(editor.redo(session), true);
  assert.equal(editor.pageCount(session), 5);
  assert.equal(editor.redo(session), true);
  assert.equal(editor.pageCount(session), 6);
  assert.equal(editor.redo(session), true);
  assert.equal(editor.pageCount(session), 7);

  const output = await editor.buildBlob(session);
  assert.equal(output.type, 'application/pdf');
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


test('objetos sobre página acompanham página, histórico, duplicação e exclusão', async () => {
  const editor = editorWithFakePdfLib();
  const session = await editor.createSession(
    new Blob([new Uint8Array([2])], { type: 'application/pdf' }),
    { label: 'Documento inicial' }
  );

  const textId = editor.addTextObject(session, 0, {
    text: 'Texto sintético',
    x: .2,
    y: .3,
    width: .4,
    fontFamily: 'Arial',
    fontSize: .04,
    color: '#123456',
    opacity: .8
  });
  assert.ok(textId);
  assert.equal(editor.objectModel(session).length, 1);
  assert.equal(editor.objectModel(session)[0].displayPage, 1);
  assert.equal(editor.objectModel(session)[0].text, 'Texto sintético');

  assert.equal(editor.updateObject(session, textId, {
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecoration: 'underline',
    textAlign: 'center'
  }), true);
  let formatted = editor.objectModel(session).find((item) => item.id === textId);
  assert.equal(formatted.fontWeight, 'bold');
  assert.equal(formatted.fontStyle, 'italic');
  assert.equal(formatted.textDecoration, 'underline');
  assert.equal(formatted.textAlign, 'center');
  assert.equal(editor.undo(session), true);
  formatted = editor.objectModel(session).find((item) => item.id === textId);
  assert.equal(formatted.fontWeight, 'normal');
  assert.equal(formatted.fontStyle, 'normal');
  assert.equal(formatted.textDecoration, 'none');
  assert.equal(formatted.textAlign, 'left');
  assert.equal(editor.redo(session), true);

  assert.equal(editor.updateObject(session, textId, { x: .35, rotation: 27 }, { commit: false }), true);
  assert.equal(editor.commitObjectMutation(session), true);
  assert.equal(Math.round(editor.objectModel(session)[0].rotation), 27);
  assert.equal(editor.undo(session), true);
  assert.equal(Number(editor.objectModel(session)[0].x.toFixed(2)), .2);
  assert.equal(editor.redo(session), true);
  assert.equal(Number(editor.objectModel(session)[0].x.toFixed(2)), .35);

  assert.equal(editor.movePageTo(session, 0, 1), true);
  assert.equal(editor.objectModel(session)[0].displayPage, 2);

  const duplicateAt = editor.duplicatePage(session, 1);
  assert.equal(duplicateAt, 2);
  assert.equal(editor.pageCount(session), 3);
  assert.equal(editor.objectModel(session).length, 2);
  assert.notEqual(editor.objectModel(session)[0].id, editor.objectModel(session)[1].id);
  assert.equal(editor.objectModel(session)[1].displayPage, 3);

  assert.equal(editor.removePage(session, 2), true);
  assert.equal(editor.objectModel(session).length, 1);

  const imageId = await editor.addImageOverlay(
    session,
    0,
    new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' }),
    { x: .1, y: .1, width: .25, height: .2 }
  );
  assert.ok(imageId);
  const image = editor.objectModel(session).find((item) => item.id === imageId);
  assert.equal(image.type, 'image');
  assert.equal(image.displayPage, 1);
  assert.ok(image.blob instanceof Blob);

  assert.equal(editor.moveObjectToPage(session, imageId, 1, { x: .45, y: .25, commit: false }), true);
  assert.equal(editor.objectModel(session).find((item) => item.id === imageId).displayPage, 2);
  assert.equal(editor.commitObjectMutation(session), true);
  assert.equal(editor.undo(session), true);
  assert.equal(editor.objectModel(session).find((item) => item.id === imageId).displayPage, 1);
  assert.equal(editor.redo(session), true);
  assert.equal(editor.objectModel(session).find((item) => item.id === imageId).displayPage, 2);

  assert.equal(editor.removeObject(session, imageId), true);
  assert.equal(editor.objectModel(session).some((item) => item.id === imageId), false);
  assert.equal(editor.undo(session), true);
  assert.equal(editor.objectModel(session).some((item) => item.id === imageId), true);
});

