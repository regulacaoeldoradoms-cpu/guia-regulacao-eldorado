import test from 'node:test';
import assert from 'node:assert/strict';
import { INTRO_APPLICATIONS, attachIntroApplications, validateIntroApplications } from '../studies-content/sfn-aplicacao-v1.js';

const sectionIds = [...new Set(['autoavaliacao', ...INTRO_APPLICATIONS.flatMap((item) => item.sectionIds)])];
const question = Object.freeze({ id: 'q.fixture', answer: 0, options: ['A', 'B'] });
const fixture = Object.freeze({
  id: 'banking.sfn.introducao', topicId: 'banking.sfn', contentVersion: 2, xp: 100,
  questions: Object.freeze([question]),
  sections: Object.freeze(sectionIds.map((id) => Object.freeze({ id, heading: id, body: 'Ensino de teste' })))
});
const sources = new Map(INTRO_APPLICATIONS.flatMap((item) => item.sourceIds.map((id) => [id, {}])));

test('suplemento contém três casos com explicação, critérios e ensino correspondente', () => {
  assert.equal(INTRO_APPLICATIONS.length, 3);
  assert.equal(new Set(INTRO_APPLICATIONS.map((item) => item.id)).size, 3);
  assert.deepEqual(validateIntroApplications([attachIntroApplications(fixture)], sources), []);
  for (const item of INTRO_APPLICATIONS) {
    assert.equal(item.version, 1);
    assert.equal(item.kind, 'self-explanation');
    assert.equal(item.points, undefined);
    assert.equal(item.answer, undefined);
    assert.equal(item.correctOption, undefined);
  }
});

test('anexação imutável preserva questões, ensino, identidade e recompensa', () => {
  const result = attachIntroApplications(fixture);
  assert.equal(result.id, fixture.id);
  assert.equal(result.topicId, fixture.topicId);
  assert.equal(result.contentVersion, fixture.contentVersion);
  assert.equal(result.xp, fixture.xp);
  assert.strictEqual(result.questions, fixture.questions);
  for (const section of result.sections) {
    const before = fixture.sections.find((entry) => entry.id === section.id);
    assert.equal(section.body, before.body);
    assert.equal(section.heading, before.heading);
    if (section.id !== 'autoavaliacao') assert.strictEqual(section, before);
    else {
      assert.equal(before.applicationTasks, undefined);
      assert.equal(section.applicationVersion, 1);
      assert.strictEqual(section.applicationTasks, INTRO_APPLICATIONS);
    }
  }
  assert.ok(Object.isFrozen(result));
  assert.ok(Object.isFrozen(result.sections));
});

test('outras aulas não recebem atividades sem planejamento próprio', () => {
  const other = { ...fixture, id: 'banking.sfn.cmn' };
  assert.strictEqual(attachIntroApplications(other), other);
});

test('validador rejeita ausência de material ou integração desligada', () => {
  assert.deepEqual(validateIntroApplications([], sources), ['application:missing-anchor']);
  assert.ok(validateIntroApplications([fixture], sources).includes('application:not-attached'));
  const shortened = { ...fixture, sections: fixture.sections.filter((item) => item.id !== 'intermediacao') };
  assert.ok(validateIntroApplications([attachIntroApplications(shortened)], sources)
    .includes('apply.sfn.intermediacao.v1:unknown-section:intermediacao'));
});

test('validador não aceita uma referência de fonte inexistente', () => {
  const errors = validateIntroApplications([attachIntroApplications(fixture)], new Map());
  assert.ok(errors.includes('apply.sfn.papeis.v1:unknown-source:cvm.educacao.estrutura-sfn'));
});
