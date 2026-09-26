import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  PUBLISHED_MISSIONS,
  PLANNED_MISSIONS,
  STUDY_SOURCES,
  missionByTopicId,
  questionById
} from '../studies-content/manifest.js';
import { computeCampaignProgress, isStudiesApi, studyUsernameAllowed } from '../studies.js';

test('conteudo SFN v1.2 tem ids unicos e respostas validas', () => {
  const missionIds = new Set();
  const questionIds = new Set();
  for (const mission of PUBLISHED_MISSIONS) {
    assert.ok(!missionIds.has(mission.id), mission.id);
    missionIds.add(mission.id);
    assert.match(mission.id, /^banking\./);
    assert.ok(mission.sections.length >= 2);
    assert.ok(mission.questions.length >= 3);
    for (const question of mission.questions) {
      assert.ok(!questionIds.has(question.id), question.id);
      questionIds.add(question.id);
      assert.ok(Number.isInteger(question.answer));
      assert.ok(question.answer >= 0 && question.answer < question.options.length);
      assert.ok(question.explanation.length > 10);
      assert.equal(questionById(question.id)?.question.id, question.id);
    }
  }
  assert.equal(PUBLISHED_MISSIONS.length, 9);
  assert.equal(PLANNED_MISSIONS.length, 9);
  assert.equal(PLANNED_MISSIONS.length, PUBLISHED_MISSIONS.length);
});

test('fontes do recorte sao oficiais e datadas', () => {
  assert.ok(STUDY_SOURCES.length >= 18);
  for (const source of STUDY_SOURCES) {
    assert.match(source.url, /^https:\/\//);
    assert.ok(['2026-09-25', '2026-09-26'].includes(source.checkedAt), source.id);
  }
});

test('namespace de API e isolado', () => {
  assert.equal(isStudiesApi('/api/studies/bootstrap'), true);
  assert.equal(isStudiesApi('/api/studies/attempts'), true);
  assert.equal(isStudiesApi('/api/telemedicina/foo'), false);
  assert.equal(isStudiesApi('/api/study/bootstrap'), false);
});

test('gate aceita somente a identidade normalizada de Wellyton', () => {
  assert.equal(studyUsernameAllowed('wellyton'), true);
  assert.equal(studyUsernameAllowed(' WELLYTON '), true);
  assert.equal(studyUsernameAllowed('wel lyton'), false);
  assert.equal(studyUsernameAllowed('josiane'), false);
  assert.equal(studyUsernameAllowed(''), false);
});

test('planejamento do Mundo 1 permanece fixo durante a expansao', () => {
  const plannedIds = PLANNED_MISSIONS.map((item) => item.id);
  assert.equal(new Set(plannedIds).size, plannedIds.length);
  assert.equal(plannedIds.length, 9);
  for (const mission of PUBLISHED_MISSIONS) {
    assert.ok(plannedIds.includes(mission.id), mission.id);
  }
  assert.ok(plannedIds.includes('banking.sfn.seguros-previdencia'));
  assert.ok(plannedIds.includes('banking.sfn.pagamentos-consorcios'));
  assert.ok(plannedIds.includes('banking.sfn.boss'));
});


test('publicar novas missões não reduz o progresso conquistado', () => {
  const progress = {
    'banking.sfn': { coverageState: 3 },
    'banking.sfn.cmn': { coverageState: 3 }
  };
  const initialPublished = PUBLISHED_MISSIONS.slice(0, 4);
  const expandedPublished = PUBLISHED_MISSIONS.slice(0, 6);

  const before = computeCampaignProgress(progress, initialPublished, PLANNED_MISSIONS);
  const after = computeCampaignProgress(progress, expandedPublished, PLANNED_MISSIONS);

  assert.equal(before.campaignProgress, after.campaignProgress);
  assert.equal(before.campaignProgress, 22.2);
  assert.equal(before.availableCompletion, 50);
  assert.equal(after.availableCompletion, 33.3);
  assert.equal(before.campaignAvailability, 44.4);
  assert.equal(after.campaignAvailability, 66.7);
});


test('topicId resolve exatamente uma missão publicada', () => {
  for (const mission of PUBLISHED_MISSIONS) {
    assert.equal(missionByTopicId(mission.topicId)?.id, mission.id);
  }
  assert.equal(missionByTopicId('banking.sfn.inexistente'), null);
});

test('revisão espaçada exige prática nova e XP idempotente', () => {
  const source = fs.readFileSync(new URL('../studies.js', import.meta.url), 'utf8');
  assert.match(source, /handleCompleteReview/);
  assert.match(source, /attempted_at >= \?/);
  assert.match(source, /review_complete/);
  assert.match(source, /INSERT OR IGNORE INTO study_xp_events/);
  assert.match(source, /Esta revisão já foi concluída/);
  assert.match(source, /Responda todas as questões novamente antes de concluir a revisão/);
});


test('Chefe do SFN exige 75% em 12 questões cumulativas', () => {
  const boss = PUBLISHED_MISSIONS.find((mission) => mission.id === 'banking.sfn.boss');
  assert.ok(boss);
  assert.equal(boss.kind, 'boss');
  assert.equal(boss.passScore, 75);
  assert.equal(boss.questions.length, 12);
  assert.ok(boss.xp > 0);
});

test('backend do Chefe usa a rodada atual e só premia após aprovação', () => {
  const source = fs.readFileSync(new URL('../studies.js', import.meta.url), 'utf8');
  assert.match(source, /bossRunScore/);
  assert.match(source, /status='active'/);
  assert.match(source, /attempted_at >= \?/);
  assert.match(source, /Chefe não vencido/);
  assert.match(source, /study\.sfn\.boss/);
  assert.match(source, /SFN dominado/);
});
