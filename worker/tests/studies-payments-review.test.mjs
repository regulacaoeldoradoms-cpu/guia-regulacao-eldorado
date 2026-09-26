import test from 'node:test';
import assert from 'node:assert/strict';
import { PAYMENTS_REVIEW_APPLICATIONS as applications, attachPaymentsReviewApplications as attach, validatePaymentsReviewApplications as validate } from '../studies-content/sfn-aplicacao-pagamentos-revisao-v1.js';

const ordered = ['banking.sfn.introducao', 'banking.sfn.cmn', 'banking.sfn.bacen', 'banking.sfn.copom', 'banking.sfn.cvm', 'banking.sfn.operadores', 'banking.sfn.seguros-previdencia', 'banking.sfn.pagamentos-consorcios', 'banking.sfn.boss'];
const tasks = Object.values(applications).flat();
const base = ordered.map((id, index) => {
  const sections = new Set(['resumo']);
  for (const item of applications[id] || []) for (const key of item.sectionIds) sections.add(key);
  for (const item of tasks) for (const ref of item.originRefs) if (ref.missionId === id) sections.add(ref.sectionId);
  return Object.freeze({
    id, topicId: id, order: index + 1, kind: index === 8 ? 'boss' : 'lesson', contentVersion: 2,
    passScore: index === 8 ? 75 : 0, xp: index === 8 ? 220 : 100,
    sourceIds: Object.freeze(['original.source']),
    questions: Object.freeze([Object.freeze({ id: `fixture.${index}`, answer: 0 })]),
    sections: Object.freeze([...sections].map((key) => Object.freeze({ id: key, heading: key, body: 'Ensino da fixture', type: 'explanation' })))
  });
});
const catalog = base.map(attach);
const sources = new Map(['original.source', ...tasks.flatMap((item) => item.sourceIds)].map((id) => [id, {}]));
const paymentId = ordered[7], bossId = ordered[8];
const replace = (id, transform) => catalog.map((mission) => mission.id === id ? transform(mission) : mission);

test('seis atividades identificadas, com critérios e sem campos de pontuação', () => {
  assert.deepEqual(Object.keys(applications), [paymentId, bossId]);
  assert.equal(tasks.length, 6);
  assert.equal(new Set(tasks.map((item) => item.id)).size, 6);
  for (const item of tasks) {
    assert.equal(item.kind, 'self-explanation');
    assert.equal(item.version, 1);
    assert.equal(item.criteria.length, 3);
    for (const key of ['points', 'xp', 'answer', 'correctOption']) assert.equal(item[key], undefined);
    for (const key of ['criteria', 'sourceIds', 'sectionIds', 'originRefs']) assert.ok(Object.isFrozen(item[key]));
    for (const ref of item.originRefs) assert.ok(Object.isFrozen(ref));
  }
});

test('referências de ensino, fontes e aulas de origem resolvem na fixture', () => {
  assert.deepEqual(validate(catalog, sources), []);
});

test('anexação preserva todo o texto, perguntas e regras; fontes são apenas acrescentadas', () => {
  base.forEach((before, index) => {
    const after = catalog[index];
    for (const key of ['id', 'topicId', 'order', 'kind', 'passScore', 'xp', 'contentVersion']) assert.equal(after[key], before[key]);
    assert.strictEqual(after.questions, before.questions);
    assert.deepEqual(before.sourceIds, ['original.source']);
    assert.ok(after.sourceIds.includes('original.source'));
    assert.equal(after.sourceIds.length, new Set(after.sourceIds).size);
    before.sections.forEach((section, i) => {
      for (const key of ['id', 'body', 'heading', 'type']) assert.equal(after.sections[i][key], section[key]);
      assert.equal(section.applicationTasks, undefined);
    });
    assert.ok(Object.isFrozen(after));
    assert.ok(Object.isFrozen(after.sections));
  });
});

test('suplemento idempotente não modifica as sete aulas anteriores', () => {
  base.slice(0, 7).forEach((mission) => assert.strictEqual(attach(mission), mission));
  catalog.forEach((mission) => assert.strictEqual(attach(mission), mission));
  assert.equal(attach(null), null);
  assert.equal(catalog.filter((m) => m.sections.some((s) => s.applicationTasks)).length, 2);
});

test('falta de missão, âncora ou ligação não é aceita como integração', () => {
  assert.ok(validate([], sources).includes(`${paymentId}:missing-mission`));
  assert.ok(validate(base, sources).includes(`${paymentId}:not-attached`));
  const withoutAnchor = { ...base[7], sections: base[7].sections.filter((s) => s.id !== 'resumo') };
  assert.strictEqual(attach(withoutAnchor), withoutAnchor);
  assert.ok(validate(replace(paymentId, () => withoutAnchor), sources).includes(`${paymentId}:missing-anchor`));
});

test('ensino local ausente e fonte ausente são identificados', () => {
  const empty = replace(paymentId, (m) => ({ ...m, sections: m.sections.map((s) => s.id === 'spi' ? { ...s, body: ' ' } : s) }));
  assert.ok(validate(empty, sources).includes('apply.pag.arranjo.v1:unknown-teaching:spi'));
  assert.ok(validate(catalog, new Map()).includes('apply.pag.consorcio.v1:unknown-source:planalto.consorcios.11795'));
  const missing = replace(paymentId, (m) => ({ ...m, sourceIds: [] }));
  assert.ok(validate(missing, sources).includes('apply.pag.consorcio.v1:source-outside-lesson:planalto.consorcios.11795'));
});

test('revisão cumulativa não aceita origem inexistente ou futura', () => {
  const absent = catalog.filter((m) => m.id !== 'banking.sfn.cmn');
  assert.ok(validate(absent, sources).includes('apply.boss.funcoes.v1:unknown-origin:banking.sfn.cmn:papel'));
  const future = replace('banking.sfn.cmn', (m) => ({ ...m, order: 10 }));
  assert.ok(validate(future, sources).includes('apply.boss.funcoes.v1:origin-not-earlier:banking.sfn.cmn'));
  const sameOrder = replace('banking.sfn.cmn', (m) => ({ ...m, order: 9 }));
  assert.ok(validate(sameOrder, sources).includes('apply.boss.funcoes.v1:origin-not-earlier:banking.sfn.cmn'));
});

test('os casos cumulativos possuem apoio nas oito aulas anteriores', () => {
  const origins = new Set(applications[bossId].flatMap((item) => item.originRefs.map((ref) => ref.missionId)));
  assert.deepEqual([...origins].sort(), ordered.slice(0, 8).sort());
  for (const item of applications[bossId]) assert.ok(item.originRefs.length > 0);
  for (const item of applications[paymentId]) assert.equal(item.originRefs.length, 0);
});

test('outro suplemento não é sobrescrito para aparentar conformidade', () => {
  const other = [{ id: 'previous' }];
  const collision = { ...base[8], sections: base[8].sections.map((s) => s.id === 'resumo' ? { ...s, applicationTasks: other } : s) };
  assert.strictEqual(attach(collision), collision);
  assert.strictEqual(collision.sections.find((s) => s.id === 'resumo').applicationTasks, other);
  assert.ok(validate(replace(bossId, () => collision), sources).includes(`${bossId}:not-attached`));
});
