import test from 'node:test';
import assert from 'node:assert/strict';

import { PUBLISHED_MISSIONS } from '../studies-content/manifest.js';
import {
  SFN_TRANSFER_ASSESSMENT,
  assessmentQuestionById,
  validateSfnTransferAssessment
} from '../studies-content/sfn-assessment-v1.js';

test('avaliação independente tem duas formas de doze questões e catálogo válido', () => {
  assert.equal(SFN_TRANSFER_ASSESSMENT.forms.length, 2);
  assert.equal(SFN_TRANSFER_ASSESSMENT.questionCount, 12);
  assert.deepEqual(validateSfnTransferAssessment(PUBLISHED_MISSIONS), []);
  for (const form of SFN_TRANSFER_ASSESSMENT.forms) assert.equal(form.questions.length, 12);
});

test('24 IDs são exclusivos e não colidem com as 38 questões de prática', () => {
  const regular = new Set(PUBLISHED_MISSIONS.flatMap((mission) => mission.questions.map((q) => q.id)));
  assert.equal(regular.size, 38);
  const independent = SFN_TRANSFER_ASSESSMENT.forms.flatMap((form) => form.questions);
  assert.equal(independent.length, 24);
  assert.equal(new Set(independent.map((q) => q.id)).size, 24);
  for (const item of independent) {
    assert.equal(regular.has(item.id), false, item.id);
    assert.strictEqual(assessmentQuestionById(item.id)?.question, item);
  }
});

test('cada forma cobre as seis competências e só referencia ensino anterior real', () => {
  const expected = ['estrutura','mercado-capitais','operadores','pagamentos-consorcios','politica-monetaria','seguros-previdencia'];
  const catalog = new Map(PUBLISHED_MISSIONS.map((mission) => [mission.id, mission]));
  for (const form of SFN_TRANSFER_ASSESSMENT.forms) {
    assert.deepEqual([...new Set(form.questions.map((q) => q.competency))].sort(), expected);
    for (const item of form.questions) {
      assert.equal(item.options.length, 4);
      assert.ok(Number.isInteger(item.answer));
      assert.ok(item.explanation.length > 30);
      assert.ok(item.teachingRefs.length > 0);
      for (const ref of item.teachingRefs) {
        const mission = catalog.get(ref.missionId);
        assert.ok(mission, ref.missionId);
        assert.notEqual(mission.kind, 'boss');
        assert.ok(mission.sections.some((section) => section.id === ref.sectionId && section.body.trim()),
          `${item.id} -> ${ref.missionId}/${ref.sectionId}`);
      }
    }
  }
});

test('formas não repetem enunciados e não usam o Chefe como material de ensino', () => {
  const questions = SFN_TRANSFER_ASSESSMENT.forms.flatMap((form) => form.questions);
  assert.equal(new Set(questions.map((q) => q.prompt.trim().toLowerCase())).size, questions.length);
  assert.ok(questions.every((q) => q.teachingRefs.every((ref) => ref.missionId !== 'banking.sfn.boss')));
});

test('a avaliação é diagnóstica: conteúdo não define XP, aprovação ou readiness', () => {
  assert.equal(SFN_TRANSFER_ASSESSMENT.xp, undefined);
  assert.equal(SFN_TRANSFER_ASSESSMENT.passScore, undefined);
  assert.equal(SFN_TRANSFER_ASSESSMENT.readiness, undefined);
  assert.match(SFN_TRANSFER_ASSESSMENT.description, /Não concede XP/);
});
