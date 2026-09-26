import test from 'node:test';
import assert from 'node:assert/strict';
import { PUBLISHED_MISSIONS as original, PLANNED_MISSIONS as planned } from '../studies-content/banking-sfn.js';
import { PUBLISHED_MISSIONS, PLANNED_MISSIONS, STUDY_SOURCES, missionById, missionByTopicId, questionById, sourceMap, validateTeachingCatalog } from '../studies-content/manifest.js';

const lesson = missionById('banking.sfn.introducao');

test('introdução explica nomes antes de cobrar siglas', () => {
  assert.equal(lesson.contentVersion, 2);
  assert.match(lesson.objective, /Sistema Financeiro Nacional \(SFN\)/);
  const bodies = lesson.sections.map((item) => item.body).join('\n');
  assert.match(lesson.sections[0].body, /SFN significa Sistema Financeiro Nacional/);
  assert.match(bodies, /Conselho Monetário Nacional \(CMN\)/);
  assert.match(bodies, /Banco Central do Brasil/);
  assert.match(bodies, /BC ou BCB/);
  assert.match(bodies, /intermediação financeira/);
  assert.match(bodies, /Situação inventada/);
});

test('todas as missões atuais têm ensino, exemplos, consulta e resumo', () => {
  assert.deepEqual(validateTeachingCatalog(), []);
  assert.equal(PUBLISHED_MISSIONS.length, 9);
  assert.equal(PUBLISHED_MISSIONS.filter((mission) => mission.kind === 'boss').length, 1);
  for (const mission of PUBLISHED_MISSIONS) {
    assert.equal(mission.contentVersion, 2);
    for (const section of mission.sections) {
      assert.equal(typeof section.heading, 'string');
      assert.equal(typeof section.body, 'string');
      assert.ok(section.body.trim().length > 0);
      assert.doesNotMatch(section.body, /<script|<iframe|javascript:/i);
    }
  }
});

test('correção do curso inteiro preserva IDs, questões, recompensas e regras do Chefe', () => {
  assert.equal(PUBLISHED_MISSIONS.length, original.length);
  assert.strictEqual(PLANNED_MISSIONS, planned);
  for (const before of original) {
    const after = missionById(before.id);
    assert.equal(after.id, before.id);
    assert.equal(after.topicId, before.topicId);
    assert.equal(after.order, before.order);
    assert.equal(after.xp, before.xp);
    assert.equal(after.kind, before.kind);
    assert.equal(after.passScore, before.passScore);
    assert.strictEqual(after.questions, before.questions);
  }
});

test('as 38 questões apontam para trechos reais de ensino', () => {
  const total = PUBLISHED_MISSIONS.reduce((sum, mission) => sum + mission.questions.length, 0);
  assert.equal(total, 38);
  for (const mission of PUBLISHED_MISSIONS) {
    assert.strictEqual(missionByTopicId(mission.topicId), mission);
    for (const question of mission.questions) {
      assert.strictEqual(questionById(question.id).mission, mission);
      assert.strictEqual(questionById(question.id).question, question);
      assert.ok(mission.teaching.questionCoverage[question.id].length > 0);
    }
  }
  assert.equal(missionById('inexistente'), null);
  assert.equal(missionByTopicId('inexistente'), null);
  assert.equal(questionById('inexistente'), null);
});

test('questões do Chefe identificam aulas anteriores, não conteúdo inédito', () => {
  const boss = missionById('banking.sfn.boss');
  for (const question of boss.questions) {
    const origins = boss.teaching.questionCoverage[question.id].filter((ref) => ref.missionId !== boss.id);
    assert.ok(origins.length > 0);
    for (const ref of origins) assert.ok(missionById(ref.missionId).order < boss.order);
  }
});

test('validador rejeita missão só com perguntas, mesmo com título e XP', () => {
  const questionOnly = { ...lesson, sections: [], teaching: undefined };
  const errors = validateTeachingCatalog([questionOnly]);
  assert.ok(errors.includes(`${lesson.id}:missing-explanation`));
  assert.ok(errors.includes(`${lesson.id}:missing-worked-example`));
  assert.ok(errors.includes(`${lesson.id}:missing-glossary`));
  assert.ok(errors.includes(`${lesson.id}:missing-summary`));
  assert.ok(errors.includes('q.sfn.01:missing-teaching-reference'));
});

test('validador rejeita link de ensino inexistente', () => {
  const broken = {
    ...lesson,
    teaching: { ...lesson.teaching, questionCoverage: {
      ...lesson.teaching.questionCoverage,
      'q.sfn.01': [{ missionId: lesson.id, sectionId: 'nao-existe' }]
    }}
  };
  assert.ok(validateTeachingCatalog([broken]).includes('q.sfn.01:broken-teaching-reference'));
});

test('validador rejeita cobrança de aula futura', () => {
  const future = { ...lesson, id: 'future.topic', topicId: 'future.topic', order: 99, questions: [] };
  const early = {
    ...lesson,
    teaching: { ...lesson.teaching, questionCoverage: {
      ...lesson.teaching.questionCoverage,
      'q.sfn.01': [{ missionId: future.id, sectionId: 'nome' }]
    }}
  };
  assert.ok(validateTeachingCatalog([early, future]).includes('q.sfn.01:future-prerequisite'));
});

test('fontes de todas as aulas são únicas e resolvíveis', () => {
  const sources = sourceMap();
  assert.equal(sources.size, STUDY_SOURCES.length);
  for (const mission of PUBLISHED_MISSIONS) {
    for (const sourceId of mission.sourceIds) assert.ok(sources.has(sourceId), sourceId);
  }
  for (const source of STUDY_SOURCES) {
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(url.hostname === 'www.gov.br' || url.hostname.endsWith('.bcb.gov.br') || url.hostname === 'www.bb.com.br' || url.hostname === 'www.caixa.gov.br');
  }
});
