import test from 'node:test';
import assert from 'node:assert/strict';
import { PUBLISHED_MISSIONS, missionById, questionById, sourceMap, validateTeachingCatalog } from '../studies-content/manifest.js';
import { PUBLISHED_MISSIONS as BASE } from '../studies-content/banking-sfn.js';
import { INTRO_APPLICATIONS, validateIntroApplications } from '../studies-content/sfn-aplicacao-v1.js';
import { MONETARY_APPLICATIONS, validateMonetaryApplications } from '../studies-content/sfn-aplicacao-cmn-bcb-v1.js';
import { SFN_LESSONS_V2 } from '../studies-content/sfn-aulas-v2.js';
import { reviseFundamentalsSections } from '../studies-content/sfn-fundamentos-revisados.js';
import { reviseSegmentsSections } from '../studies-content/sfn-segmentos-revisados.js';

test('catálogo servido inclui os três casos iniciais com trechos reais e fontes existentes', () => {
  assert.deepEqual(validateTeachingCatalog(), []);
  assert.deepEqual(validateIntroApplications(PUBLISHED_MISSIONS, sourceMap()), []);
  const intro = missionById('banking.sfn.introducao');
  assert.strictEqual(intro.sections.find((section) => section.id === 'autoavaliacao').applicationTasks, INTRO_APPLICATIONS);
});

test('casos formativos não entram na pontuação nem no total das 38 questões', () => {
  assert.equal(PUBLISHED_MISSIONS.reduce((total, mission) => total + mission.questions.length, 0), 38);
  for (const before of BASE) {
    const after = missionById(before.id);
    assert.strictEqual(after.questions, before.questions);
    for (const key of ['id', 'topicId', 'order', 'xp', 'kind', 'passScore']) assert.equal(after[key], before[key]);
  }
  for (const item of [...INTRO_APPLICATIONS, ...Object.values(MONETARY_APPLICATIONS).flat()]) assert.equal(questionById(item.id), null);
  const enabled = PUBLISHED_MISSIONS.filter((mission) => mission.sections.some((section) => section.applicationTasks));
  assert.deepEqual(enabled.map((mission) => mission.id), ['banking.sfn.introducao', 'banking.sfn.cmn', 'banking.sfn.bacen']);
});

test('CMN e Banco Central recebem seis casos próprios sem repetir IDs da introdução', () => {
  assert.deepEqual(validateMonetaryApplications(PUBLISHED_MISSIONS, sourceMap()), []);
  const all = PUBLISHED_MISSIONS.flatMap((mission) => mission.sections.flatMap((section) => section.applicationTasks || []));
  assert.equal(all.length, 9);
  assert.equal(new Set(all.map((item) => item.id)).size, 9);
  for (const [missionId, items] of Object.entries(MONETARY_APPLICATIONS)) {
    const mission = missionById(missionId);
    assert.strictEqual(mission.sections.find((section) => section.id === 'resumo').applicationTasks, items);
    assert.equal(mission.teaching.reviewStatus, 'human-review-pending');
  }
});

test('o texto já revisado é preservado integralmente antes dos exercícios', () => {
  for (const id of Object.keys(MONETARY_APPLICATIONS)) {
    const before = reviseSegmentsSections(id, reviseFundamentalsSections(id, SFN_LESSONS_V2[id].sections));
    const after = missionById(id).sections;
    assert.equal(after.length, before.length);
    for (let index = 0; index < before.length; index++) {
      for (const key of ['id', 'heading', 'body', 'type']) assert.equal(after[index][key], before[index][key]);
    }
  }
});

test('Chefe e aulas seguintes não recebem suplemento antes de planejamento específico', () => {
  for (const mission of PUBLISHED_MISSIONS.filter((item) => item.order > 3)) {
    assert.equal(mission.sections.some((section) => section.applicationTasks), false);
  }
});
