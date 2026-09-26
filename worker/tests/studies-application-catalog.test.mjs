import test from 'node:test';
import assert from 'node:assert/strict';
import { PUBLISHED_MISSIONS, STUDY_SOURCES, missionById, questionById, sourceMap, validateTeachingCatalog } from '../studies-content/manifest.js';
import { PUBLISHED_MISSIONS as BASE } from '../studies-content/banking-sfn.js';
import { INTRO_APPLICATIONS, validateIntroApplications } from '../studies-content/sfn-aplicacao-v1.js';
import { MONETARY_APPLICATIONS, validateMonetaryApplications } from '../studies-content/sfn-aplicacao-cmn-bcb-v1.js';
import { MARKET_APPLICATIONS, validateMarketApplications } from '../studies-content/sfn-aplicacao-copom-cvm-v1.js';
import { OPERATORS_INSURANCE_APPLICATIONS, OPERATORS_INSURANCE_SOURCES, validateOperatorsInsuranceApplications } from '../studies-content/sfn-aplicacao-operadores-seguros-v1.js';
import { PAYMENTS_REVIEW_APPLICATIONS, validatePaymentsReviewApplications } from '../studies-content/sfn-aplicacao-pagamentos-revisao-v1.js';
import { SFN_LESSONS_V2 } from '../studies-content/sfn-aulas-v2.js';
import { reviseFundamentalsSections } from '../studies-content/sfn-fundamentos-revisados.js';
import { reviseSegmentsSections } from '../studies-content/sfn-segmentos-revisados.js';

const expectedMissionIds = ['banking.sfn.introducao', 'banking.sfn.cmn', 'banking.sfn.bacen', 'banking.sfn.copom', 'banking.sfn.cvm', 'banking.sfn.operadores', 'banking.sfn.seguros-previdencia', 'banking.sfn.pagamentos-consorcios', 'banking.sfn.boss'];
const previousTasks = [...INTRO_APPLICATIONS, ...Object.values(MONETARY_APPLICATIONS).flat(), ...Object.values(MARKET_APPLICATIONS).flat(), ...Object.values(OPERATORS_INSURANCE_APPLICATIONS).flat()];
const allTasks = [...previousTasks, ...Object.values(PAYMENTS_REVIEW_APPLICATIONS).flat()];

test('catálogo servido mantém ensino e casos iniciais com fontes existentes', () => {
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
    for (const sourceId of before.sourceIds) assert.ok(after.sourceIds.includes(sourceId));
  }
  for (const item of allTasks) assert.equal(questionById(item.id), null);
  const enabled = PUBLISHED_MISSIONS.filter((mission) => mission.sections.some((section) => section.applicationTasks));
  assert.deepEqual(enabled.map((mission) => mission.id), expectedMissionIds);
});

test('CMN e Banco Central mantêm seus seis casos e a introdução continua com três', () => {
  assert.deepEqual(validateMonetaryApplications(PUBLISHED_MISSIONS, sourceMap()), []);
  assert.equal(Object.values(MONETARY_APPLICATIONS).flat().length, 6);
  assert.equal(INTRO_APPLICATIONS.length, 3);
  for (const [missionId, items] of Object.entries(MONETARY_APPLICATIONS)) {
    const mission = missionById(missionId);
    assert.strictEqual(mission.sections.find((section) => section.id === 'resumo').applicationTasks, items);
    assert.equal(mission.teaching.reviewStatus, 'human-review-pending');
  }
});

test('Copom e CVM mantêm seus seis casos com referências ao próprio ensino', () => {
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

test('Operadores e Seguros têm seis casos sustentados por ensino e fontes disponíveis', () => {
  assert.deepEqual(validateOperatorsInsuranceApplications(PUBLISHED_MISSIONS, sourceMap()), []);
  assert.equal(Object.values(OPERATORS_INSURANCE_APPLICATIONS).flat().length, 6);
  for (const [missionId, items] of Object.entries(OPERATORS_INSURANCE_APPLICATIONS)) {
    const mission = missionById(missionId);
    assert.strictEqual(mission.sections.find((section) => section.id === 'resumo').applicationTasks, items);
    assert.equal(mission.teaching.reviewStatus, 'human-review-pending');
  }
  assert.equal(sourceMap().size, STUDY_SOURCES.length);
  for (const source of OPERATORS_INSURANCE_SOURCES) assert.strictEqual(sourceMap().get(source.id), source);
});

test('27 IDs únicos preservam os 21 casos anteriores sem duplicá-los', () => {
  const published = PUBLISHED_MISSIONS.flatMap((mission) => mission.sections.flatMap((section) => section.applicationTasks || []));
  assert.equal(previousTasks.length, 21);
  assert.equal(allTasks.length, 27);
  assert.equal(published.length, 27);
  assert.equal(new Set(published.map((item) => item.id)).size, 27);
  assert.deepEqual(published.map((item) => item.id), allTasks.map((item) => item.id));
  for (const item of previousTasks) assert.strictEqual(published.find((task) => task.id === item.id), item);
  for (const item of published) {
    for (const key of ['answer', 'correctOption', 'points', 'xp']) assert.equal(item[key], undefined);
  }
});

test('o texto de cada aula já revisada é preservado integralmente', () => {
  for (const id of [...Object.keys(MONETARY_APPLICATIONS), ...Object.keys(MARKET_APPLICATIONS), ...Object.keys(OPERATORS_INSURANCE_APPLICATIONS), ...Object.keys(PAYMENTS_REVIEW_APPLICATIONS)]) {
    const before = reviseSegmentsSections(id, reviseFundamentalsSections(id, SFN_LESSONS_V2[id].sections));
    const after = missionById(id).sections;
    assert.equal(after.length, before.length);
    for (let i = 0; i < before.length; i++) {
      for (const key of ['id', 'heading', 'body', 'type']) assert.equal(after[i][key], before[i][key]);
    }
  }
});

test('Pagamentos e preparação do Chefe recebem somente os seis casos planejados', () => {
  assert.deepEqual(validatePaymentsReviewApplications(PUBLISHED_MISSIONS, sourceMap()), []);
  for (const [id, tasks] of Object.entries(PAYMENTS_REVIEW_APPLICATIONS)) {
    assert.strictEqual(missionById(id).sections.find((s) => s.id === 'resumo').applicationTasks, tasks);
    assert.equal(tasks.length, 3);
  }
  const boss = missionById('banking.sfn.boss');
  assert.equal(boss.kind, 'boss');
  assert.equal(boss.passScore, 75);
  assert.equal(boss.questions.length, 12);
  assert.equal(boss.xp, 220);
});

test('revisão cumulativa aponta somente para trechos reais de aulas anteriores', () => {
  const boss = missionById('banking.sfn.boss');
  const tasks = PAYMENTS_REVIEW_APPLICATIONS[boss.id];
  const origins = new Set();
  for (const item of tasks) {
    assert.ok(item.originRefs.length > 0);
    for (const ref of item.originRefs) {
      const sourceMission = missionById(ref.missionId);
      assert.ok(sourceMission.order < boss.order);
      assert.ok(sourceMission.sections.some((s) => s.id === ref.sectionId && s.body.trim()));
      origins.add(ref.missionId);
    }
  }
  assert.deepEqual([...origins].sort(), expectedMissionIds.slice(0, 8).sort());
});
