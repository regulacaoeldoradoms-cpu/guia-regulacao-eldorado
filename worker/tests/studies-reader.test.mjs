import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../../js/studies-reader.js', import.meta.url), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const reader = sandbox.window.StudyReader;

test('índice de leitura limita saltos inválidos sem presumir aprendizagem', () => {
  assert.equal(reader.partIndex(3, 15), 3);
  assert.equal(reader.partIndex(-5, 15), 0);
  assert.equal(reader.partIndex(100, 15), 14);
  assert.equal(reader.partIndex('inválido', 15), 0);
  assert.equal(reader.partIndex(2, 0), 0);
  assert.equal(reader.partIndex(2, -1), 0);
  assert.equal(reader.partIndex(1.8, 3), 1);
});

test('barra de questões é zero antes da primeira resposta, sem 35% fictícios', () => {
  const normalize = (value) => JSON.parse(JSON.stringify(value));
  assert.deepEqual(normalize(reader.practiceProgress(0, 3)), { count: 0, total: 3, percent: 0 });
  assert.deepEqual(normalize(reader.practiceProgress(1, 3)), { count: 1, total: 3, percent: 33 });
  assert.deepEqual(normalize(reader.practiceProgress(4, 3)), { count: 3, total: 3, percent: 100 });
  assert.deepEqual(normalize(reader.practiceProgress(NaN, 0)), { count: 0, total: 0, percent: 0 });
});

test('HTML anterior ou inexistente não exige controlador novo', () => {
  assert.equal(reader.create(null), null);
  assert.equal(reader.create({ querySelector: () => null }), null);
});

test('o navegador de leitura não concede XP nem envia respostas', () => {
  assert.doesNotMatch(source, /\bfetch\s*\(|RegulationAuth|\.api\s*\(|localStorage|sessionStorage|\/api\//);
  assert.doesNotMatch(source, /innerHTML\s*=/);
  const client = fs.readFileSync(new URL('../../js/studies.js', import.meta.url), 'utf8');
  assert.match(client, /reader\?\.mount\(mission\)/);
  assert.match(client, /StudyReader\?\.practiceProgress/);
  assert.doesNotMatch(client, /35 \+ \(answered \/ total\)/);
});

test('dependências locais versionadas e painéis com fallback linear', () => {
  const html = fs.readFileSync(new URL('../../estudos/index.html', import.meta.url), 'utf8');
  assert.ok(html.indexOf('/js/studies-reader.js?') < html.indexOf('/js/studies.js?'));
  assert.match(html, /id="studyLessonPanel" aria-label=/);
  assert.match(html, /id="studyPracticePanel" aria-label=/);
  assert.doesNotMatch(html, /id="studyPracticePanel"[^>]*\bhidden\b/);
  assert.match(html, /id="studyReaderNav" hidden/);
  assert.match(html, /id="studyPracticeProgress" role="progressbar"/);
});
