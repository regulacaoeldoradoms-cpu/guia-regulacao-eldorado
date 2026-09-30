import test from 'node:test';
import assert from 'node:assert/strict';
import { PUBLISHED_MISSIONS } from '../studies-content/manifest.js';
import {
  QUESTION_FEEDBACK_V1,
  questionFeedbackById,
  validateQuestionFeedback
} from '../studies-content/question-feedback-v1.js';

const pilotMissionIds = new Set([
  'banking.sfn.introducao',
  'banking.sfn.cmn',
  'banking.sfn.bacen',
  'banking.sfn.copom',
  'banking.sfn.cvm',
  'banking.sfn.operadores',
  'banking.sfn.seguros-previdencia',
  'banking.sfn.pagamentos-consorcios',
  'banking.sfn.boss'
]);

test('feedback pedagógico V1 cobre todas as trinta e oito questões do primeiro bloco', () => {
  assert.deepEqual(validateQuestionFeedback(PUBLISHED_MISSIONS.filter(m => pilotMissionIds.has(m.id))), []);
  assert.equal(QUESTION_FEEDBACK_V1.length, 38);
  const pilotQuestions = PUBLISHED_MISSIONS
    .filter((mission) => pilotMissionIds.has(mission.id))
    .flatMap((mission) => mission.questions);
  assert.equal(pilotQuestions.length, 38);
  assert.deepEqual(
    new Set(QUESTION_FEEDBACK_V1.map((item) => item.questionId)),
    new Set(pilotQuestions.map((item) => item.id))
  );
});

test('cada alternativa das nove missões possui justificativa específica pós-resposta', () => {
  for (const mission of PUBLISHED_MISSIONS.filter((item) => pilotMissionIds.has(item.id))) {
    for (const question of mission.questions) {
      const feedback = questionFeedbackById(question.id);
      assert.ok(feedback, question.id);
      assert.equal(feedback.optionReasons.length, question.options.length);
      assert.ok(feedback.optionReasons.every((reason) => reason.trim().length >= 20));
    }
  }
});

test('catálogo de feedback não altera objetos das questões nem seus gabaritos', () => {
  for (const mission of PUBLISHED_MISSIONS) {
    for (const question of mission.questions) {
      assert.equal(Object.prototype.hasOwnProperty.call(question, 'optionReasons'), false);
      assert.equal(Object.prototype.hasOwnProperty.call(question, 'selectedFeedback'), false);
    }
  }
});
