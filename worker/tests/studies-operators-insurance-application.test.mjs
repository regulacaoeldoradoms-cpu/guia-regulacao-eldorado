import test from 'node:test';
import assert from 'node:assert/strict';
import { OPERATORS_INSURANCE_APPLICATIONS as applications, OPERATORS_INSURANCE_SOURCES as addedSources, attachOperatorsInsuranceApplications as attach, validateOperatorsInsuranceApplications as validate } from '../studies-content/sfn-aplicacao-operadores-seguros-v1.js';

const ids = Object.keys(applications);
const tasks = Object.values(applications).flat();
const base = ids.map((id, index) => Object.freeze({
  id, topicId: id, order: index + 6, contentVersion: 2, xp: 120,
  sourceIds: Object.freeze(['source.existing']),
  questions: Object.freeze([Object.freeze({ id: `q.fixture.${index}`, answer: 0 })]),
  sections: Object.freeze([...new Set(['resumo', ...applications[id].flatMap((item) => item.sectionIds)])]
    .map((sectionId) => Object.freeze({ id: sectionId, type: 'explanation', heading: sectionId, body: 'Ensino de teste' })))
}));
const catalog = base.map(attach);
const sources = new Map(['source.existing', ...tasks.flatMap((item) => item.sourceIds)].map((id) => [id, {}]));

test('seis casos com explicação e critérios, sem alternativa correta ou pontos', () => {
  assert.deepEqual(ids, ['banking.sfn.operadores', 'banking.sfn.seguros-previdencia']);
  assert.equal(tasks.length, 6);
  assert.equal(new Set(tasks.map((item) => item.id)).size, 6);
  assert.deepEqual(validate(catalog, sources), []);
  for (const item of tasks) {
    assert.equal(item.kind, 'self-explanation');
    assert.equal(item.version, 1);
    assert.ok(Object.isFrozen(item));
    for (const key of ['criteria', 'sectionIds', 'sourceIds']) assert.ok(Object.isFrozen(item[key]));
    for (const key of ['points', 'xp', 'answer', 'correctOption']) assert.equal(item[key], undefined);
  }
});

test('anexação preserva identidade, texto e perguntas e apenas acrescenta fontes', () => {
  for (let i = 0; i < base.length; i++) {
    const before = base[i], after = catalog[i];
    for (const key of ['id', 'topicId', 'order', 'contentVersion', 'xp']) assert.equal(after[key], before[key]);
    assert.strictEqual(after.questions, before.questions);
    assert.deepEqual(before.sourceIds, ['source.existing']);
    assert.ok(after.sourceIds.includes('source.existing'));
    assert.equal(new Set(after.sourceIds).size, after.sourceIds.length);
    before.sections.forEach((section, index) => {
      const next = after.sections[index];
      for (const key of ['id', 'heading', 'body', 'type']) assert.equal(next[key], section[key]);
      assert.equal(section.applicationTasks, undefined);
      if (section.id !== 'resumo') assert.strictEqual(next, section);
    });
    assert.ok(Object.isFrozen(after));
    assert.ok(Object.isFrozen(after.sections));
    assert.ok(Object.isFrozen(after.sourceIds));
  }
});

test('reanexar não duplica atividades ou fontes; outras missões permanecem iguais', () => {
  for (const mission of catalog) {
    assert.strictEqual(attach(mission), mission);
    assert.equal(mission.sections.flatMap((section) => section.applicationTasks || []).length, 3);
  }
  for (const id of ['banking.sfn.introducao', 'banking.sfn.cvm', 'banking.sfn.pagamentos-consorcios', 'banking.sfn.boss']) {
    const other = { ...base[0], id };
    assert.strictEqual(attach(other), other);
  }
  assert.equal(attach(null), null);
});

test('missão, âncora e integração ausentes são reportadas', () => {
  assert.ok(validate([], sources).includes(`${ids[0]}:missing-mission`));
  assert.ok(validate(base, sources).includes(`${ids[0]}:not-attached`));
  const missing = { ...base[0], sections: base[0].sections.filter((s) => s.id !== 'resumo') };
  assert.strictEqual(attach(missing), missing);
  assert.ok(validate([missing, catalog[1]], sources).includes(`${ids[0]}:missing-anchor`));
});

test('referência de ensino faltante ou vazia não é aceita', () => {
  for (const sections of [catalog[0].sections.filter((s) => s.id !== 'carteira'), catalog[0].sections.map((s) => s.id === 'carteira' ? { ...s, body: ' ' } : s)]) {
    assert.ok(validate([{ ...catalog[0], sections }, catalog[1]], sources).includes('apply.oper.canais.v1:unknown-teaching:carteira'));
  }
});

test('fontes precisam existir no catálogo e no material da aula', () => {
  assert.equal(addedSources.length, 1);
  assert.equal(new URL(addedSources[0].url).hostname, 'www.gov.br');
  assert.equal(addedSources[0].kind, 'conteudo-oficial');
  assert.ok(validate(catalog, new Map()).includes('apply.segprev.premio.v1:unknown-source:susep.faq.seguros.premio'));
  const noSources = { ...catalog[1], sourceIds: [] };
  assert.ok(validate([catalog[0], noSources], sources).includes('apply.segprev.premio.v1:source-outside-lesson:susep.faq.seguros.premio'));
});

test('suplemento conflitante não é apagado para aparentar conformidade', () => {
  const other = [{ id: 'other.activity' }];
  const collision = { ...base[0], sections: base[0].sections.map((s) => s.id !== 'resumo' ? s : { ...s, applicationTasks: other }) };
  assert.strictEqual(attach(collision), collision);
  assert.strictEqual(collision.sections.find((s) => s.id === 'resumo').applicationTasks, other);
  assert.ok(validate([collision, catalog[1]], sources).includes(`${ids[0]}:not-attached`));
});
