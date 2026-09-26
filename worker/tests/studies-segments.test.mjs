import test from 'node:test';
import assert from 'node:assert/strict';
import { PUBLISHED_MISSIONS, missionById, missionByTopicId, questionById, sourceMap, validateTeachingCatalog } from '../studies-content/manifest.js';
import { PUBLISHED_MISSIONS as original } from '../studies-content/banking-sfn.js';
import { SEGMENTS_REVIEW, SEGMENTS_SOURCES, reviseSegmentsSections, validateSegmentsTargets } from '../studies-content/sfn-segmentos-revisados.js';
import { validateFundamentalsTargets } from '../studies-content/sfn-fundamentos-revisados.js';

const ids = ['banking.sfn.cvm', 'banking.sfn.operadores', 'banking.sfn.seguros-previdencia', 'banking.sfn.pagamentos-consorcios', 'banking.sfn.boss'];

test('revisão dos cinco segmentos restantes chega ao mesmo catálogo da aplicação', () => {
  assert.deepEqual(Object.keys(SEGMENTS_REVIEW), ids);
  assert.deepEqual(validateSegmentsTargets(PUBLISHED_MISSIONS), []);
  assert.deepEqual(validateFundamentalsTargets(PUBLISHED_MISSIONS), []);
  assert.deepEqual(validateTeachingCatalog(), []);
  assert.equal(Object.values(SEGMENTS_REVIEW).reduce((sum, review) => sum + Object.keys(review.sections).length, 0), 25);
  for (const id of ids) {
    const mission = missionById(id);
    assert.equal(mission.teaching.editorialPass, 'segmentos-r1');
    assert.equal(mission.teaching.reviewStatus, 'human-review-pending');
    assert.strictEqual(missionByTopicId(mission.topicId), mission);
    for (const question of mission.questions) assert.strictEqual(questionById(question.id).mission, mission);
  }
});

test('revisão não apaga nem transforma os objetos de progresso e avaliação', () => {
  assert.equal(PUBLISHED_MISSIONS.length, original.length);
  for (const before of original) {
    const after = missionById(before.id);
    for (const field of ['id', 'topicId', 'order', 'xp', 'kind', 'passScore']) assert.equal(after[field], before[field]);
    assert.strictEqual(after.questions, before.questions);
  }
  assert.equal(PUBLISHED_MISSIONS.reduce((sum, mission) => sum + mission.questions.length, 0), 38);
});

test('fontes resolvem e a página histórica não finge ser norma consolidada', () => {
  const sources = sourceMap();
  for (const source of SEGMENTS_SOURCES) {
    assert.strictEqual(sources.get(source.id), source);
    assert.equal(source.checkedAt, '2026-09-26');
    assert.equal(new URL(source.url).protocol, 'https:');
  }
  const historical = sources.get('bcb.bancos-multiplos.educacional');
  assert.equal(historical.kind, 'conteudo-oficial-historico');
  assert.match(historical.label, /histórica/);
  assert.ok(sources.has('cmn.bancos.5060'));
  for (const id of ids) for (const sourceId of missionById(id).sourceIds) assert.ok(sources.has(sourceId), sourceId);
});

test('overlay é imutável e preserva IDs e trechos não revisados', () => {
  const input = Object.freeze([
    Object.freeze({ id: 'acoes', type: 'explanation', heading: 'Título', body: 'Antes' }),
    Object.freeze({ id: 'nome', type: 'explanation', heading: 'Nome', body: 'Preservado' })
  ]);
  const output = reviseSegmentsSections(ids[0], input);
  assert.equal(input[0].body, 'Antes');
  assert.equal(output[0].id, input[0].id);
  assert.equal(output[0].type, input[0].type);
  assert.equal(output[0].heading, input[0].heading);
  assert.strictEqual(output[1], input[1]);
  assert.strictEqual(reviseSegmentsSections('banking.sfn.cmn', input), input);
  assert.ok(Object.isFrozen(output));
  assert.ok(Object.isFrozen(output[0]));
});

test('alvos de revisão ausentes ou desconectados são reportados', () => {
  assert.ok(validateSegmentsTargets([]).includes(`${ids[0]}:missing-mission`));
  const withoutSection = PUBLISHED_MISSIONS.map((mission) => mission.id !== ids[0] ? mission : {
    ...mission, sections: mission.sections.filter((section) => section.id !== 'acoes')
  });
  assert.ok(validateSegmentsTargets(withoutSection).includes(`${ids[0]}:acoes:missing-section`));
  const disconnected = PUBLISHED_MISSIONS.map((mission) => mission.id !== ids[0] ? mission : {
    ...mission, sections: mission.sections.map((section) => section.id !== 'acoes' ? section : { ...section, body: 'Texto anterior' })
  });
  assert.ok(validateSegmentsTargets(disconnected).includes(`${ids[0]}:acoes:revision-not-applied`));
});

test('Chefe continua referenciado às aulas anteriores e não declara retenção comprovada', () => {
  const boss = missionById('banking.sfn.boss');
  assert.equal(boss.passScore, 75);
  assert.equal(boss.questions.length, 12);
  for (const question of boss.questions) {
    const refs = boss.teaching.questionCoverage[question.id];
    assert.ok(refs.some((ref) => missionById(ref.missionId).order < boss.order));
  }
  assert.match(boss.sections.find((section) => section.id === 'resumo').body, /não demonstra sozinho domínio duradouro/);
});
