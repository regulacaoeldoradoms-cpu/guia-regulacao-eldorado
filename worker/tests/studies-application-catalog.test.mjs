import test from 'node:test';
import assert from 'node:assert/strict';
import { PUBLISHED_MISSIONS, missionById, questionById, sourceMap, validateTeachingCatalog } from '../studies-content/manifest.js';
import { PUBLISHED_MISSIONS as BASE } from '../studies-content/banking-sfn.js';
import { INTRO_APPLICATIONS, validateIntroApplications } from '../studies-content/sfn-aplicacao-v1.js';

test('catálogo servido inclui os três casos com trechos reais e fontes existentes', () => {
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
  for (const item of INTRO_APPLICATIONS) assert.equal(questionById(item.id), null);
  assert.equal(PUBLISHED_MISSIONS.filter((mission) => mission.sections.some((section) => section.applicationTasks)).length, 1);
});
