import test from 'node:test';
import assert from 'node:assert/strict';
import { MARKET_APPLICATIONS, attachMarketApplications, validateMarketApplications } from '../studies-content/sfn-aplicacao-copom-cvm-v1.js';

const ids = Object.keys(MARKET_APPLICATIONS);
const tasks = Object.values(MARKET_APPLICATIONS).flat();
function fixture(id) {
  const sourceIds = [...new Set(MARKET_APPLICATIONS[id].flatMap((item) => item.sourceIds))];
  const sectionIds = [...new Set(['resumo', ...MARKET_APPLICATIONS[id].flatMap((item) => item.sectionIds)])];
  return Object.freeze({
    id, topicId: id, order: ids.indexOf(id) + 4, contentVersion: 2, xp: 100,
    questions: Object.freeze([Object.freeze({ id: `q.fixture.${ids.indexOf(id)}`, answer: 0 })]),
    sourceIds: Object.freeze(sourceIds),
    sections: Object.freeze(sectionIds.map((sectionId) => Object.freeze({ id: sectionId, heading: sectionId, body: 'Ensino de teste', type: 'explanation' })))
  });
}
const base = ids.map(fixture);
const catalog = base.map(attachMarketApplications);
const sources = new Map(tasks.flatMap((item) => item.sourceIds.map((id) => [id, {}])));

test('Copom/CVM: seis situações com comentários e critérios, sem pontuação', () => {
  assert.deepEqual(ids, ['banking.sfn.copom', 'banking.sfn.cvm']);
  assert.equal(tasks.length, 6);
  assert.equal(new Set(tasks.map((item) => item.id)).size, 6);
  assert.deepEqual(validateMarketApplications(catalog, sources), []);
  for (const item of tasks) {
    assert.equal(item.kind, 'self-explanation');
    assert.equal(item.version, 1);
    assert.ok(Object.isFrozen(item));
    for (const key of ['criteria', 'sectionIds', 'sourceIds']) assert.ok(Object.isFrozen(item[key]));
    for (const key of ['points', 'xp', 'answer', 'correctOption']) assert.equal(item[key], undefined);
    for (const key of ['prompt', 'model']) assert.doesNotMatch(item[key], /<script|javascript:/i);
  }
});

test('anexação não modifica ensino, identidade, fontes ou questões', () => {
  for (const before of base) {
    const after = attachMarketApplications(before);
    for (const key of ['id', 'topicId', 'order', 'contentVersion', 'xp']) assert.equal(after[key], before[key]);
    assert.strictEqual(after.questions, before.questions);
    assert.strictEqual(after.sourceIds, before.sourceIds);
    for (let i = 0; i < before.sections.length; i++) {
      const previous = before.sections[i], next = after.sections[i];
      for (const key of ['id', 'body', 'heading', 'type']) assert.equal(next[key], previous[key]);
      assert.equal(previous.applicationTasks, undefined);
      if (previous.id !== 'resumo') assert.strictEqual(next, previous);
      else assert.equal(next.applicationVersion, 1);
    }
    assert.ok(Object.isFrozen(after));
    assert.ok(Object.isFrozen(after.sections));
  }
});

test('reanexar não duplica e missões fora do recorte ficam intactas', () => {
  for (const item of catalog) {
    assert.strictEqual(attachMarketApplications(item), item);
    assert.equal(item.sections.flatMap((s) => s.applicationTasks || []).length, 3);
  }
  for (const id of ['banking.sfn.introducao', 'banking.sfn.cmn', 'banking.sfn.bacen', 'banking.sfn.boss']) {
    const other = { ...base[0], id };
    assert.strictEqual(attachMarketApplications(other), other);
  }
});

test('falta de missão, âncora ou integração é detectada sem lançar no carregamento', () => {
  assert.ok(validateMarketApplications([], sources).includes(`${ids[0]}:missing-mission`));
  assert.ok(validateMarketApplications(base, sources).includes(`${ids[0]}:not-attached`));
  const missing = { ...base[0], sections: base[0].sections.filter((s) => s.id !== 'resumo') };
  assert.strictEqual(attachMarketApplications(missing), missing);
  assert.ok(validateMarketApplications([missing, catalog[1]], sources).includes(`${ids[0]}:missing-anchor`));
});

test('nenhuma atividade passa sem o trecho de ensino referenciado', () => {
  const missing = { ...catalog[0], sections: catalog[0].sections.filter((s) => s.id !== 'meta') };
  assert.ok(validateMarketApplications([missing, catalog[1]], sources).includes('apply.copom.contrato.v1:unknown-teaching:meta'));
  const blank = { ...catalog[0], sections: catalog[0].sections.map((s) => s.id !== 'meta' ? s : { ...s, body: '   ' }) };
  assert.ok(validateMarketApplications([blank, catalog[1]], sources).includes('apply.copom.contrato.v1:unknown-teaching:meta'));
});

test('fonte deve existir no catálogo e estar disponível na aula', () => {
  assert.ok(validateMarketApplications(catalog, new Map()).includes('apply.copom.contrato.v1:unknown-source:bcb.copom'));
  const absent = { ...catalog[1], sourceIds: [] };
  assert.ok(validateMarketApplications([catalog[0], absent], sources).includes('apply.cvm.destino.v1:source-outside-lesson:planalto.cvm.6385'));
});

test('colisão com outro suplemento não é apagada nem declarada válida', () => {
  const otherItems = Object.freeze([{ id: 'other' }]);
  const collision = { ...base[0], sections: base[0].sections.map((s) => s.id !== 'resumo' ? s : { ...s, applicationTasks: otherItems }) };
  assert.strictEqual(attachMarketApplications(collision), collision);
  assert.strictEqual(collision.sections.find((s) => s.id === 'resumo').applicationTasks, otherItems);
  assert.ok(validateMarketApplications([collision, catalog[1]], sources).includes(`${ids[0]}:not-attached`));
});
