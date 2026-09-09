import assert from 'node:assert/strict';
import {
  conditionReadyForRequest,
  deriveFollowupStatus,
  isDischargeAchievement,
  looksClosed,
  reminderMetaFor,
  returnDueFromRecord
} from '../telemedicine-rules.js';

const conditionalWaiting = {
  active: true,
  resolution: 'RETORNO APÓS EXAMES',
  returnDueDate: '',
  reminderDates: [],
  requestedAt: '',
  requestedHistorical: false
};

assert.equal(conditionReadyForRequest(conditionalWaiting), false);
assert.equal(deriveFollowupStatus(conditionalWaiting, '2026-09-08'), 'SEM PROGRAMAÇÃO');

const conditionalReady = {
  ...conditionalWaiting,
  resolution: 'RETORNO APÓS EXAMES - JÁ REALIZADO'
};

assert.equal(conditionReadyForRequest(conditionalReady), true);
assert.equal(deriveFollowupStatus(conditionalReady, '2026-09-08'), 'SOLICITAR');
assert.equal(returnDueFromRecord('2026-09-08', conditionalReady.resolution), '');
assert.deepEqual(reminderMetaFor(conditionalReady, '2026-09-08'), {
  alertToday: false,
  reminderNumber: 0,
  remindersRemaining: 0,
  reminderDates: []
});
assert.equal(deriveFollowupStatus({ ...conditionalReady, requestedAt: '2026-09-08' }, '2026-09-08'), 'SOLICITADO');

assert.equal(looksClosed('PACIENTE DESISTIU DO TRATAMENTO'), true);
assert.equal(looksClosed('DESISTÊNCIA DO TRATAMENTO'), true);
assert.equal(looksClosed('ENCAMINHADO PARA ATENDIMENTO PRESENCIAL'), true);
assert.equal(looksClosed('RETORNO APÓS FISIOTERAPIA - JÁ REALIZADO'), false);

assert.equal(isDischargeAchievement({ active: false, followupMode: 'discharge', resolution: 'ALTA DO EPISÓDIO' }), true);
assert.equal(isDischargeAchievement({ active: false, resolution: 'ALTA' }), true);
assert.equal(isDischargeAchievement({ active: false, resolution: 'PACIENTE DESISTIU DO TRATAMENTO' }), false);
assert.equal(isDischargeAchievement({ active: false, resolution: 'ENCAMINHADO PARA ATENDIMENTO PRESENCIAL' }), false);
assert.equal(deriveFollowupStatus({ active: false, followupMode: 'discharge', resolution: 'ALTA DO EPISÓDIO' }, '2026-09-09'), 'CONCLUÍDO');

console.log('Telemedicina Outcomes V25 + Alta Conquista V28: OK');
