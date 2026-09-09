import assert from 'node:assert/strict';
import fs from 'node:fs';
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
assert.equal(isDischargeAchievement({
  source: 'manual',
  active: false,
  discharged: true,
  followupMode: 'discharge',
  resolution: 'PACIENTE DESISTIU DO TRATAMENTO'
}), false);
assert.equal(isDischargeAchievement({
  source: 'legacy',
  active: false,
  discharged: true,
  followupMode: 'discharge',
  resolution: 'ENCAMINHADO PARA ATENDIMENTO PRESENCIAL',
  notes: ''
}), false);
assert.equal(deriveFollowupStatus({ active: false, followupMode: 'discharge', resolution: 'ALTA DO EPISÓDIO' }, '2026-09-09'), 'CONCLUÍDO');

assert.equal(isDischargeAchievement({ source: 'legacy', active: false, resolution: 'SIM', notes: '' }), true);
assert.equal(isDischargeAchievement({ source: 'legacy', active: false, resolution: 'SIMM', notes: '' }), true);
assert.equal(isDischargeAchievement({ source: 'legacy', active: false, resolution: '', notes: 'Regulação reagiu com 🏆' }), true);
assert.equal(isDischargeAchievement({ source: 'legacy', active: true, resolution: 'SIM, RETORNO APÓS EXAMES', notes: '' }), false);
assert.equal(isDischargeAchievement({ source: 'manual', active: false, resolution: 'SIM', notes: '' }), false);
assert.equal(deriveFollowupStatus({ source: 'legacy', active: true, resolution: 'RETORNO COM 60 DIAS', notes: 'Regulação reagiu com 🏆' }, '2026-09-09'), 'CONCLUÍDO');

const altasClient = fs.readFileSync(new URL('../../js/telemedicina-altas-v30.js', import.meta.url), 'utf8');
assert.match(altasClient, /function isNonDischargeClosure\(followup\)/);
assert.match(altasClient, /function isDischargeAchievement\(followup\)/);
assert.match(altasClient, /isDischargeAchievement\(followup\).*followup\.status === COMPLETED_STATUS/s);
assert.match(altasClient, /DESISTIU/);
assert.match(altasClient, /PRESENCIAL/);

console.log('Telemedicina Outcomes V25 + Altas históricas V32 + encerramentos V33: OK');
