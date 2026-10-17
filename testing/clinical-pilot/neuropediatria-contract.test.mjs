'use strict';
// Regression guard for the two structured DigSaúde Neuropediatria conditions.
// Run: node --test testing/clinical-pilot/neuropediatria-contract.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (file) => JSON.parse(readFileSync(new URL('../../data/clinical-conditions/' + file, import.meta.url), 'utf8'));
const records = [
  ['Convulsão/Epilepsia', read('convulsao-epilepsia-20261016.json')],
  ['Cefaleia', read('cefaleia-neuropediatria-20261016.json')]
];
const byId = (record, id) => record.rules.find((rule) => rule.id === id);

for (const [name, record] of records) {
  test(name + ': avaliação neurológica obrigatória e visível em uma seção própria', () => {
    assert.equal(record.parentProtocolId, 'neuropediatria');
    assert.equal(record.system, 'DigSaúde MS');
    const neuro = byId(record, 'NEURO');
    assert.ok(neuro, 'NEURO ausente');
    assert.equal(neuro.group, 'clinicalAssessment');
    assert.equal(neuro.requirement, 'obrigatorio');
    assert.match(neuro.text, /exame (?:físico )?neurológico/i);
    const section = record.sections.find(section => section.ruleIds.includes('NEURO'));
    assert.ok(section, 'Falta uma seção visível que contenha NEURO');
    assert.equal(section.receptionCheck, true);
    assert.match(section.label, /avaliação clínica obrigatória/i);
    assert.ok(neuro.sourceLocations?.length, 'Falta página de fonte para o exame');
    assert.ok(record.sections.some(section => section.ruleIds.includes('RESPONSAVEL')));
  });
  test(name + ': exames de imagem não promovidos a obrigatórios', () => {
    for (const id of ['TC', 'RM']) {
      const rule = byId(record, id);
      assert.ok(rule);
      assert.equal(rule.group, 'documents');
      assert.equal(rule.requirement, 'opcional_documental');
      assert.equal(rule.availability, 'se_houver');
    }
  });
}
test('Convulsão/Epilepsia: EEG se houver e exclusão corretamente vinculada', () => {
  const record = records[0][1];
  assert.equal(byId(record, 'EEG').availability, 'se_houver');
  assert.deepEqual(byId(record, 'CRISE').exceptionRefs, ['FEBRIL']);
});
test('Cefaleia: diário obrigatório, distinto dos exames complementares', () => {
  const record = records[1][1];
  const diary = byId(record, 'DIARIO');
  assert.equal(diary.requirement, 'obrigatorio');
  assert.ok(record.sections.some(section => /registro obrigatório/i.test(section.label) && section.ruleIds.includes('DIARIO')));
});
test('Fontes: ambos os recortes têm protocolo e revisão próprios', () => {
  for (const [, record] of records) {
    assert.ok(record.reference.includes('Telessaúde MS 2.0'));
    assert.ok(record.revision && record.sources?.length);
  }
});
