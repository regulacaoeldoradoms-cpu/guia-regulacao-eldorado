import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PUBLISHED_MISSIONS,
  PLANNED_MISSIONS,
  STUDY_SOURCES,
  questionById
} from '../studies-content/manifest.js';
import { isStudiesApi, studyUsernameAllowed } from '../studies.js';

test('conteudo SFN v1.1 tem ids unicos e respostas validas', () => {
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
  assert.equal(PUBLISHED_MISSIONS.length, 6);
  assert.equal(PLANNED_MISSIONS.length, 9);
  assert.ok(PLANNED_MISSIONS.length > PUBLISHED_MISSIONS.length);
});

test('fontes do recorte sao oficiais e datadas', () => {
  assert.ok(STUDY_SOURCES.length >= 10);
  for (const source of STUDY_SOURCES) {
    assert.match(source.url, /^https:\/\//);
    assert.equal(source.checkedAt, '2026-09-25');
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
