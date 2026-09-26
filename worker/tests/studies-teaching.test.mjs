import test from 'node:test';
import assert from 'node:assert/strict';
import { PUBLISHED_MISSIONS as original, PLANNED_MISSIONS as planned } from '../studies-content/banking-sfn.js';
import { PUBLISHED_MISSIONS, PLANNED_MISSIONS, STUDY_SOURCES, missionById, missionByTopicId, questionById, sourceMap } from '../studies-content/manifest.js';

const lesson = missionById('banking.sfn.introducao');

test('a aula inicial publicada explica nomes antes de cobrar siglas', () => {
  assert.equal(lesson.contentVersion, 2);
  assert.match(lesson.objective, /Sistema Financeiro Nacional \(SFN\)/);
  const bodies = lesson.sections.map((item) => item.body).join('\n');
  assert.match(lesson.sections[0].body, /SFN significa Sistema Financeiro Nacional/);
  assert.match(bodies, /Conselho Monetário Nacional \(CMN\)/);
  assert.match(bodies, /Banco Central do Brasil/);
  assert.match(bodies, /BC ou BCB/);
  assert.match(bodies, /intermediação financeira/);
  assert.match(bodies, /Situação inventada/);
  assert.ok(lesson.sections.some((section) => section.heading.includes('Exemplo resolvido')));
  assert.ok(lesson.sections.some((section) => section.heading.includes('resumo de consulta')));
  for (const section of lesson.sections) {
    assert.equal(typeof section.heading, 'string');
    assert.equal(typeof section.body, 'string');
    assert.ok(section.body.length > 0);
    assert.doesNotMatch(section.body, /<script|<iframe|javascript:/i);
  }
});

test('revisão pedagógica não altera progresso, recompensas ou gabaritos existentes', () => {
  assert.equal(PUBLISHED_MISSIONS.length, original.length);
  assert.strictEqual(PLANNED_MISSIONS, planned);
  for (const before of original) {
    const after = missionById(before.id);
    assert.equal(after.id, before.id);
    assert.equal(after.topicId, before.topicId);
    assert.equal(after.order, before.order);
    assert.equal(after.xp, before.xp);
    assert.strictEqual(after.questions, before.questions);
    if (before.id !== 'banking.sfn.introducao') assert.strictEqual(after, before);
  }
});

test('resolução por missão, tópico e questão usa a mesma aula revisada', () => {
  assert.strictEqual(missionByTopicId(lesson.topicId), lesson);
  for (const question of lesson.questions) {
    assert.strictEqual(questionById(question.id).mission, lesson);
    assert.strictEqual(questionById(question.id).question, question);
  }
  assert.equal(missionById('inexistente'), null);
  assert.equal(missionByTopicId('inexistente'), null);
  assert.equal(questionById('inexistente'), null);
});

test('fontes da nova aula são únicas e resolvíveis no catálogo oficial', () => {
  const sources = sourceMap();
  assert.equal(sources.size, STUDY_SOURCES.length);
  for (const sourceId of lesson.sourceIds) assert.ok(sources.has(sourceId), sourceId);
  for (const source of STUDY_SOURCES) {
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(url.hostname === 'www.gov.br' || url.hostname.endsWith('.bcb.gov.br') || url.hostname === 'www.bb.com.br' || url.hostname === 'www.caixa.gov.br');
  }
});
