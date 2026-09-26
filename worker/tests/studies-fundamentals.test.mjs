import test from 'node:test';
import assert from 'node:assert/strict';
import { PUBLISHED_MISSIONS, missionById, sourceMap, validateTeachingCatalog } from '../studies-content/manifest.js';
import { FUNDAMENTALS_REVIEW, reviseFundamentalsSections, validateFundamentalsTargets } from '../studies-content/sfn-fundamentos-revisados.js';
import { PUBLISHED_MISSIONS as original } from '../studies-content/banking-sfn.js';

const ids = ['banking.sfn.introducao', 'banking.sfn.cmn', 'banking.sfn.bacen', 'banking.sfn.copom'];

test('revisão dos fundamentos está aplicada no catálogo realmente servido', () => {
  assert.deepEqual(Object.keys(FUNDAMENTALS_REVIEW), ids);
  assert.deepEqual(validateFundamentalsTargets(PUBLISHED_MISSIONS), []);
  assert.deepEqual(validateTeachingCatalog(), []);
  for (const id of ids) {
    const mission = missionById(id);
    assert.equal(mission.teaching.editorialPass, 'fundamentos-r1');
    assert.equal(mission.teaching.reviewStatus, 'human-review-pending');
    for (const sectionId of Object.keys(FUNDAMENTALS_REVIEW[id].sections)) {
      assert.equal(mission.sections.find((section) => section.id === sectionId).body, FUNDAMENTALS_REVIEW[id].sections[sectionId]);
    }
  }
  assert.equal(missionById('banking.sfn.cvm').teaching.editorialPass, 'segmentos-r1');
});

test('fonte legal nova resolve sem substituir fontes existentes', () => {
  const source = sourceMap().get('planalto.bcb.lc179');
  assert.equal(source.url, 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm');
  assert.equal(source.checkedAt, '2026-09-26');
  for (const id of ids.slice(1)) assert.ok(missionById(id).sourceIds.includes(source.id));
  assert.ok(sourceMap().has('bcb.copom'));
});

test('revisão mantém identidade das seções e não modifica entradas', () => {
  const before = Object.freeze([
    Object.freeze({ id: 'cotidiano', type: 'explanation', heading: 'Título', body: 'Texto anterior' }),
    Object.freeze({ id: 'nome', type: 'explanation', heading: 'Nome', body: 'Preservado' })
  ]);
  const after = reviseFundamentalsSections(ids[0], before);
  assert.equal(before[0].body, 'Texto anterior');
  assert.equal(after[0].id, before[0].id);
  assert.equal(after[0].type, before[0].type);
  assert.equal(after[0].heading, before[0].heading);
  assert.strictEqual(after[1], before[1]);
  assert.strictEqual(reviseFundamentalsSections('banking.sfn.cvm', before), before);
  assert.ok(Object.isFrozen(after));
  assert.ok(Object.isFrozen(after[0]));
});

test('alvo ausente ou revisão desconectada não passa silenciosamente', () => {
  assert.ok(validateFundamentalsTargets([]).includes('banking.sfn.introducao:missing-mission'));
  const altered = PUBLISHED_MISSIONS.map((mission) => mission.id !== ids[0] ? mission : {
    ...mission,
    sections: mission.sections.filter((section) => section.id !== 'cotidiano')
  });
  assert.ok(validateFundamentalsTargets(altered).includes('banking.sfn.introducao:cotidiano:missing-section'));
  const disconnected = PUBLISHED_MISSIONS.map((mission) => mission.id !== ids[0] ? mission : {
    ...mission,
    sections: mission.sections.map((section) => section.id !== 'cotidiano' ? section : { ...section, body: 'Anterior' })
  });
  assert.ok(validateFundamentalsTargets(disconnected).includes('banking.sfn.introducao:cotidiano:revision-not-applied'));
});

test('nenhuma nova questão, XP ou mudança de regra foi introduzida', () => {
  assert.equal(PUBLISHED_MISSIONS.length, original.length);
  for (const before of original) {
    const after = missionById(before.id);
    assert.equal(after.topicId, before.topicId);
    assert.equal(after.order, before.order);
    assert.equal(after.xp, before.xp);
    assert.equal(after.passScore, before.passScore);
    assert.strictEqual(after.questions, before.questions);
  }
  assert.equal(PUBLISHED_MISSIONS.reduce((sum, mission) => sum + mission.questions.length, 0), 38);
});
