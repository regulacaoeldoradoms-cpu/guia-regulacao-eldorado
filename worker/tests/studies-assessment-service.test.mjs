import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';

import { sqliteD1 } from './helpers/studies-sqlite.mjs';
import { StudyRoundError } from '../study-rounds.js';
import {
  ensureAssessmentSchema, startAssessmentRun, recordAssessmentAnswer,
  completeAssessmentRun, assessmentEvidence
} from '../study-assessments.js';
import {
  SFN_TRANSFER_ASSESSMENT as assessment,
  assessmentQuestionById
} from '../studies-content/sfn-assessment-v1.js';
import { PUBLISHED_MISSIONS } from '../studies-content/manifest.js';

async function fixture(t) {
  const sql = new DatabaseSync(':memory:');
  t.after(() => sql.close());
  sql.exec('PRAGMA foreign_keys=ON');
  const db = sqliteD1(sql);
  await ensureAssessmentSchema(db);
  return { sql, db };
}
const rejected = (fn, status = 409) => assert.rejects(fn,
  (error) => error instanceof StudyRoundError && error.status === status);

async function answerAll(db, run, wrongQuestionId = '') {
  for (const publicQuestion of run.questions) {
    const item = assessmentQuestionById(publicQuestion.id).question;
    const selected = publicQuestion.id === wrongQuestionId ? (item.answer + 1) % item.options.length : item.answer;
    const result = await recordAssessmentAnswer(db, 'wellyton', assessment, run.runId, item.id, selected);
    assert.equal(Object.prototype.hasOwnProperty.call(result, 'correct'), false);
    assert.equal(Object.prototype.hasOwnProperty.call(result, 'correctOption'), false);
  }
}

test('primeira abertura usa forma A e reabrir retoma a mesma rodada', async (t) => {
  const { db, sql } = await fixture(t);
  const first = await startAssessmentRun(db, 'wellyton', assessment);
  assert.equal(first.formId, 'A');
  assert.equal(first.resumed, false);
  assert.equal(first.questions.length, 12);
  assert.deepEqual(first.answered, {});

  const question = first.questions[0];
  const real = assessmentQuestionById(question.id).question;
  const recorded = await recordAssessmentAnswer(db, 'wellyton', assessment, first.runId, question.id, real.answer);
  assert.equal(recorded.recorded, true);
  assert.equal(recorded.answered, 1);
  assert.equal(Object.prototype.hasOwnProperty.call(recorded, 'correct'), false);

  const resumed = await startAssessmentRun(db, 'wellyton', assessment);
  assert.equal(resumed.runId, first.runId);
  assert.equal(resumed.resumed, true);
  assert.equal(resumed.answered[question.id], real.answer);
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM study_assessment_runs').get().n, 1);
});

test('reenviar a mesma alternativa é idempotente e trocar após registro é recusado', async (t) => {
  const { db, sql } = await fixture(t);
  const run = await startAssessmentRun(db, 'wellyton', assessment);
  const item = assessmentQuestionById(run.questions[0].id).question;
  assert.equal((await recordAssessmentAnswer(db, 'wellyton', assessment, run.runId, item.id, item.answer)).recorded, true);
  assert.equal((await recordAssessmentAnswer(db, 'wellyton', assessment, run.runId, item.id, item.answer)).recorded, false);
  await rejected(() => recordAssessmentAnswer(db, 'wellyton', assessment, run.runId, item.id, (item.answer + 1) % 4));
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM study_assessment_answers').get().n, 1);
});

test('não conclui avaliação incompleta nem aceita questão de outra forma', async (t) => {
  const { db } = await fixture(t);
  const run = await startAssessmentRun(db, 'wellyton', assessment);
  await rejected(() => completeAssessmentRun(db, 'wellyton', assessment, run.runId, PUBLISHED_MISSIONS));
  const other = assessment.forms.find((form) => form.id !== run.formId).questions[0];
  await rejected(() => recordAssessmentAnswer(db, 'wellyton', assessment, run.runId, other.id, other.answer), 400);
});

test('conclusão revela correção somente no fim e preserva primeira evidência', async (t) => {
  const { db } = await fixture(t);
  const first = await startAssessmentRun(db, 'wellyton', assessment);
  await answerAll(db, first);
  const complete = await completeAssessmentRun(db, 'wellyton', assessment, first.runId, PUBLISHED_MISSIONS);
  assert.equal(complete.score, 100);
  assert.equal(complete.corrections.length, 12);
  assert.ok(complete.corrections.every((item) =>
    Number.isInteger(item.correctOption) && item.explanation && item.reviewTargets.length > 0
  ));

  const repeated = await completeAssessmentRun(db, 'wellyton', assessment, first.runId, PUBLISHED_MISSIONS);
  assert.equal(repeated.score, 100);
  const evidence = await assessmentEvidence(db, 'wellyton', assessment);
  assert.equal(evidence.attempts, 1);
  assert.equal(evidence.firstScore, 100);
  assert.equal(evidence.latestScore, 100);
  assert.deepEqual(evidence.formsSeen, ['A']);
});

test('segunda tentativa alterna para forma B e não apaga o primeiro resultado', async (t) => {
  const { db } = await fixture(t);
  const first = await startAssessmentRun(db, 'wellyton', assessment);
  await answerAll(db, first);
  await completeAssessmentRun(db, 'wellyton', assessment, first.runId, PUBLISHED_MISSIONS);

  const second = await startAssessmentRun(db, 'wellyton', assessment);
  assert.equal(second.formId, 'B');
  const wrong = second.questions[0].id;
  await answerAll(db, second, wrong);
  const result = await completeAssessmentRun(db, 'wellyton', assessment, second.runId, PUBLISHED_MISSIONS);
  assert.equal(result.score, 91.7);

  const evidence = await assessmentEvidence(db, 'wellyton', assessment);
  assert.equal(evidence.attempts, 2);
  assert.equal(evidence.firstScore, 100);
  assert.equal(evidence.latestScore, 91.7);
  assert.deepEqual(evidence.formsSeen, ['A', 'B']);
});

test('usuário diferente não lê, responde ou conclui a rodada alheia', async (t) => {
  const { db } = await fixture(t);
  const run = await startAssessmentRun(db, 'wellyton', assessment);
  const item = assessmentQuestionById(run.questions[0].id).question;
  await rejected(() => recordAssessmentAnswer(db, 'outro', assessment, run.runId, item.id, item.answer), 404);
  await rejected(() => completeAssessmentRun(db, 'outro', assessment, run.runId, PUBLISHED_MISSIONS), 404);
});

test('responder depois da conclusão é recusado e não cria nova linha', async (t) => {
  const { db, sql } = await fixture(t);
  const run = await startAssessmentRun(db, 'wellyton', assessment);
  await answerAll(db, run);
  await completeAssessmentRun(db, 'wellyton', assessment, run.runId, PUBLISHED_MISSIONS);
  const item = assessmentQuestionById(run.questions[0].id).question;
  await rejected(() => recordAssessmentAnswer(db, 'wellyton', assessment, run.runId, item.id, item.answer));
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM study_assessment_answers').get().n, 12);
});
