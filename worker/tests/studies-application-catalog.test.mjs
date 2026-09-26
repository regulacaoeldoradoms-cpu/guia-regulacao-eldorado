import test from 'node:test';
import assert from 'node:assert/strict';
import { PUBLISHED_MISSIONS, missionById, questionById, sourceMap, validateTeachingCatalog } from '../studies-content/manifest.js';
import { PUBLISHED_MISSIONS as BASE } from '../studies-content/banking-sfn.js';
import { INTRO_APPLICATIONS, validateIntroApplications } from '../studies-content/sfn-aplicacao-v1.js';
import { MONETARY_APPLICATIONS, validateMonetaryApplications } from '../studies-content/sfn-aplicacao-cmn-bcb-v1.js';
import { MARKET_APPLICATIONS, validateMarketApplications } from '../studies-content/sfn-aplicacao-copom-cvm-v1.js';
import { SFN_LESSONS_V2 } from '../studies-content/sfn-aulas-v2.js';
import { reviseFundamentalsSections } from '../studies-content/sfn-fundamentos-revisados.js';
import { reviseSegmentsSections } from '../studies-content/sfn-segmentos-revisados.js';

const expectedMissionIds = ['banking.sfn.introducao', 'banking.sfn.cmn', 'banking.sfn.bacen', 'banking.sfn.copom', 'banking.sfn.cvm'];
const allTasks = [...INTRO_APPLICATIONS, ...Object.values(MONETARY_APPLICATIONS).flat(), ...Object.values(MARKET_APPLICATIONS).flat()];

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
  for (const item of allTasks) assert.equal(questionById(item.id), null);
  const enabled = PUBLISHED_MISSIONS.filter((mission) => mission.sections.some((section) => section.applicationTasks));
  assert.deepEqual(enabled.map((mission) => mission.id), expectedMissionIds);
});

test('CMN e Banco Central mantêm os seis casos próprios e a introdução não é alterada', () => {
  assert.deepEqual(validateMonetaryApplications(PUBLISHED_MISSIONS, sourceMap()), []);
  assert.equal(Object.values(MONETARY_APPLICATIONS).flat().length, 6);
  assert.equal(INTRO_APPLICATIONS.length, 3);
  for (const [missionId, items] of Object.entries(MONETARY_APPLICATIONS)) {
    const mission = missionById(missionId);
    assert.strictEqual(mission.sections.find((section) => section.id === 'resumo').applicationTasks, items);
    assert.equal(mission.teaching.reviewStatus, 'human-review-pending');
  }
});

test('Copom e CVM recebem seis casos com referências verificáveis no próprio ensino', () => {
  assert.deepEqual(validateMarketApplications(PUBLISHED_MISSIONS, sourceMap()), []);
  assert.equal(Object.values(MARKET_APPLICATIONS).flat().length, 6);
  for (const [missionId, items] of Object.entries(MARKET_APPLICATIONS)) {
    const mission = missionById(missionId);
    assert.strictEqual(mission.sections.find((section) => section.id === 'resumo').applicationTasks, items);
    assert.equal(mission.teaching.reviewStatus, 'human-review-pending');
    for (const item of items) {
      assert.ok(item.sectionIds.length > 0);
      for (const sectionId of item.sectionIds) assert.ok(mission.sections.some((section) => section.id === sectionId && section.body));
    }
  }
});

test('os quinze IDs de aplicação são únicos entre todas as cinco aulas', () => {
  const publishedTasks = PUBLISHED_MISSIONS.flatMap((mission) => mission.sections.flatMap((section) => section.applicationTasks || []));
  assert.equal(allTasks.length, 15);
  assert.equal(publishedTasks.length, 15);
  assert.equal(new Set(publishedTasks.map((item) => item.id)).size, 15);
  assert.deepEqual(publishedTasks.map((item) => item.id), allTasks.map((item) => item.id));
  for (const item of publishedTasks) {
    assert.equal(item.answer, undefined);
    assert.equal(item.points, undefined);
    assert.equal(item.xp, undefined);
  }
});

test('o texto já revisado é preservado integralmente antes dos exercícios', () => {
  for (const id of [...Object.keys(MONETARY_APPLICATIONS), ...Object.keys(MARKET_APPLICATIONS)]) {
    const before = reviseSegmentsSections(id, reviseFundamentalsSections(id, SFN_LESSONS_V2[id].sections));
    const after = missionById(id).sections;
    assert.equal(after.length, before.length);
    for (let index = 0; index < before.length; index++) {
      for (const key of ['id', 'heading', 'body', 'type']) assert.equal(after[index][key], before[index][key]);
    }
  }
});

test('as quatro missões restantes não recebem suplemento sem planejamento específico', () => {
  const remaining = PUBLISHED_MISSIONS.filter((item) => item.order > 5);
  assert.equal(remaining.length, 4);
  for (const mission of remaining) {
    assert.equal(mission.sections.some((section) => section.applicationTasks), false);
  }
});
