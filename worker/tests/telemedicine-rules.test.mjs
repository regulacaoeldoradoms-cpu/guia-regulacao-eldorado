import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const source = process.argv[2];
if (!source) throw new Error('Informe o caminho do módulo de regras copiado para .mjs.');
const rules = await import(pathToFileURL(source).href);

const {
  addDays,
  nextBusinessDay,
  normalizeReturnDueDate,
  threeBusinessReminders,
  deriveFollowupStatus,
  reminderMetaFor,
  explicitReturnDays,
  returnDueFromRecord,
  looksClosed,
  looksRequested
} = rules;

assert.equal(addDays('2026-08-01', 30), '2026-08-31');
assert.equal(explicitReturnDays('RETORNO COM 30 DIAS'), 30);
assert.equal(returnDueFromRecord('2026-08-01', 'RETORNO COM 30 DIAS'), '2026-08-31');
assert.deepEqual(threeBusinessReminders('2026-08-31'), ['2026-08-17', '2026-08-18', '2026-08-19']);

// Regra reproduzida do projeto anterior: o retorno calculado também vai ao próximo dia útil.
// 14/08 + 30 dias = 13/09/2026 (domingo), portanto retorno estimado = 14/09/2026.
assert.equal(nextBusinessDay('2026-09-13'), '2026-09-14');
assert.equal(normalizeReturnDueDate('2026-09-13'), '2026-09-14');
assert.equal(returnDueFromRecord('2026-08-14', 'RETORNO COM 30 DIAS'), '2026-09-14');
assert.deepEqual(threeBusinessReminders('2026-09-14'), ['2026-08-31', '2026-09-01', '2026-09-02']);

// Outro caso histórico: 17/08 + 90 dias = 15/11/2026 (domingo), ajustando para 16/11.
assert.equal(returnDueFromRecord('2026-08-17', 'RETORNO COM 90 DIAS'), '2026-11-16');

const followup = {
  active: true,
  returnDueDate: '2026-09-28',
  reminderDates: ['2026-09-14', '2026-09-15', '2026-09-16'],
  requestedAt: '',
  requestedHistorical: false
};
assert.equal(deriveFollowupStatus(followup, '2026-09-13'), 'EM AGUARDO');
assert.equal(deriveFollowupStatus(followup, '2026-09-14'), 'SOLICITAR');
assert.equal(deriveFollowupStatus(followup, '2026-09-16'), 'SOLICITAR');
assert.equal(deriveFollowupStatus(followup, '2026-09-17'), 'ATRASADO');
assert.deepEqual(reminderMetaFor(followup, '2026-09-15'), {
  alertToday: true,
  reminderNumber: 2,
  remindersRemaining: 2,
  reminderDates: followup.reminderDates
});
assert.equal(deriveFollowupStatus({ ...followup, requestedAt: '2026-09-14' }, '2026-09-15'), 'SOLICITADO');
assert.equal(deriveFollowupStatus({ ...followup, requestedHistorical: true }, '2026-09-15'), 'SOLICITADO');
assert.equal(deriveFollowupStatus({ ...followup, active: false }, '2026-09-15'), 'CONCLUÍDO');
assert.equal(deriveFollowupStatus({ active: true, returnDueDate: '' }, '2026-09-15'), 'SEM PROGRAMAÇÃO');

assert.equal(returnDueFromRecord('2026-08-01', 'RETORNO EM 3 MESES'), '');
assert.equal(returnDueFromRecord('2026-08-01', 'RETORNO APÓS EXAMES'), '');
assert.equal(looksClosed('PACIENTE TEVE ALTA DO EPISÓDIO'), true);
assert.equal(looksClosed('TRATAMENTO FINALIZADO'), true);
assert.equal(looksRequested('RETORNO COM 30 DIAS', 'EM AGUARDO / SOLICITADO'), true);
assert.equal(looksRequested('SIM, ALTA DO EPISÓDIO', 'SOLICITADO'), false);

console.log('Telemedicina: regras de retorno e lembretes validadas.');
