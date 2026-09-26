import test from 'node:test';
import assert from 'node:assert/strict';
import { MONETARY_APPLICATIONS, attachMonetaryApplications, validateMonetaryApplications } from '../studies-content/sfn-aplicacao-cmn-bcb-v1.js';

const ids = Object.keys(MONETARY_APPLICATIONS);
const tasks = Object.values(MONETARY_APPLICATIONS).flat();
function fixture(id) {
  const sourceIds = [...new Set(MONETARY_APPLICATIONS[id].flatMap((item) => item.sourceIds))];
  const sectionIds = [...new Set(['resumo', ...MONETARY_APPLICATIONS[id].flatMap((item) => item.sectionIds)])];
  return Object.freeze({
    id, topicId: id, order: ids.indexOf(id) + 2, contentVersion: 2, xp: 100,
    questions: Object.freeze([Object.freeze({ id: `q.fixture.${ids.indexOf(id)}`, answer: 0 })]),
    sourceIds: Object.freeze(sourceIds),
    sections: Object.freeze(sectionIds.map((sectionId) => Object.freeze({ id: sectionId, heading: sectionId, body: 'Ensino de teste', type: 'explanation' })))
  });
}
const base = ids.map(fixture);
const catalog = base.map(attachMonetaryApplications);
const sources = new Map(tasks.flatMap((item) => item.sourceIds.map((id) => [id, {}])));

test('seis casos possuem comentários, critérios e referências; não são questões pontuadas', () => {
  assert.equal(ids.length, 2);
  assert.equal(tasks.length, 6);
  assert.equal(new Set(tasks.map((item) => item.id)).size, 6);
  assert.deepEqual(validateMonetaryApplications(catalog, sources), []);
  for (const task of tasks) {
    assert.equal(task.version, 1);
    assert.equal(task.kind, 'self-explanation');
    assert.ok(Object.isFrozen(task));
    assert.ok(Object.isFrozen(task.criteria));
    assert.equal(task.answer, undefined);
    assert.equal(task.correctOption, undefined);
    assert.equal(task.points, undefined);
    assert.equal(task.xp, undefined);
  }
});

test('inserção preserva perguntas e todo o material didático sem mutar a entrada', () => {
  for (const before of base) {
    const after = attachMonetaryApplications(before);
    for (const key of ['id', 'topicId', 'order', 'contentVersion', 'xp']) assert.equal(after[key], before[key]);
    assert.strictEqual(after.questions, before.questions);
    assert.strictEqual(after.sourceIds, before.sourceIds);
    for (let index = 0; index < before.sections.length; index++) {
      const old = before.sections[index];
      const next = after.sections[index];
      assert.equal(next.body, old.body);
      assert.equal(next.id, old.id);
      assert.equal(next.heading, old.heading);
      assert.equal(old.applicationTasks, undefined);
      if (old.id !== 'resumo') assert.strictEqual(next, old);
    }
    assert.ok(Object.isFrozen(after));
    assert.ok(Object.isFrozen(after.sections));
  }
});

test('segunda aplicação é idempotente e não duplica as atividades', () => {
  for (const mission of catalog) {
    assert.strictEqual(attachMonetaryApplications(mission), mission);
    assert.equal(mission.sections.flatMap((section) => section.applicationTasks || []).length, 3);
  }
});

test('não modifica introdução, Chefe ou missão sem planejamento', () => {
  for (const id of ['banking.sfn.introducao', 'banking.sfn.copom', 'banking.sfn.boss']) {
    const other = { ...base[0], id };
    assert.strictEqual(attachMonetaryApplications(other), other);
  }
});

test('ausência da missão, âncora ou vínculo é detectada sem falha no carregamento', () => {
  assert.ok(validateMonetaryApplications([], sources).includes(`${ids[0]}:missing-mission`));
  assert.ok(validateMonetaryApplications(base, sources).includes(`${ids[0]}:not-attached`));
  const missing = { ...base[0], sections: base[0].sections.filter((section) => section.id !== 'resumo') };
  assert.strictEqual(attachMonetaryApplications(missing), missing);
  assert.ok(validateMonetaryApplications([missing, catalog[1]], sources).includes(`${ids[0]}:missing-anchor`));
});

test('material ausente e fonte inexistente não são considerados válidos', () => {
  const missingTeaching = { ...catalog[0], sections: catalog[0].sections.filter((section) => section.id !== 'papel') };
  assert.ok(validateMonetaryApplications([missingTeaching, catalog[1]], sources)
    .includes('apply.cmn.escala.v1:unknown-teaching:papel'));
  assert.ok(validateMonetaryApplications(catalog, new Map())
    .includes('apply.cmn.metas.v1:unknown-source:planalto.bcb.lc179'));
  const missingSourceInLesson = { ...catalog[0], sourceIds: [] };
  assert.ok(validateMonetaryApplications([missingSourceInLesson, catalog[1]], sources)
    .includes('apply.cmn.escala.v1:source-outside-lesson:fazenda.cmn.apresentacao'));
});

test('não sobrescreve silenciosamente outro suplemento existente', () => {
  const collision = { ...base[0], sections: base[0].sections.map((section) => section.id !== 'resumo' ? section :
    { ...section, applicationTasks: [{ id: 'other' }] }) };
  assert.strictEqual(attachMonetaryApplications(collision), collision);
  assert.ok(validateMonetaryApplications([collision, catalog[1]], sources).includes(`${ids[0]}:not-attached`));
});
