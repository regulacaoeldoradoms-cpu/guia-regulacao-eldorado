import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

let moduleUrl = '';
const source = process.argv[2];
if (source) {
  moduleUrl = pathToFileURL(source).href;
} else {
  const sourcePath = fileURLToPath(new URL('../telemedicine-rules.js', import.meta.url));
  const sourceCode = await readFile(sourcePath, 'utf8');
  moduleUrl = `data:text/javascript;base64,${Buffer.from(sourceCode).toString('base64')}`;
}
const rules = await import(moduleUrl);

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
  looksRequested,
  returnConditionResolution,
  canonicalSpecialtyName
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

assert.equal(returnConditionResolution('exams'), 'RETORNO APÓS EXAMES');
assert.equal(returnConditionResolution('physiotherapy'), 'RETORNO APÓS FISIOTERAPIA');
assert.equal(returnConditionResolution('procedure', 'após liberação médica'), 'RETORNO APÓS PROCEDIMENTO OU CIRURGIA - após liberação médica');
assert.equal(returnConditionResolution('treatment'), 'RETORNO APÓS CONCLUSÃO DO TRATAMENTO');
assert.equal(returnConditionResolution('other', 'avaliação da equipe'), 'RETORNO APÓS avaliação da equipe');
assert.equal(returnConditionResolution('other'), '');
assert.equal(returnConditionResolution('desconhecido', 'texto'), '');

assert.equal(canonicalSpecialtyName('REUMATO'), 'REUMATOLOGIA');
assert.equal(canonicalSpecialtyName('rematologia'), 'REUMATOLOGIA');
assert.equal(canonicalSpecialtyName('ORTO'), 'ORTOPEDIA');
assert.equal(canonicalSpecialtyName('ortopedista'), 'ORTOPEDIA');
assert.equal(canonicalSpecialtyName('ENDOCRINOLLOGISTA'), 'ENDOCRINOLOGIA');
assert.equal(canonicalSpecialtyName('NUTRI'), 'NUTROLOGIA');
assert.equal(canonicalSpecialtyName('NUTRIÇÃO'), 'NUTROLOGIA');
assert.equal(canonicalSpecialtyName('NUTRICIONISTA'), 'NUTROLOGIA');
assert.equal(canonicalSpecialtyName('nutrologia'), 'NUTROLOGIA');
assert.equal(canonicalSpecialtyName('NEUROPED'), 'NEUROPEDIATRIA');
assert.equal(canonicalSpecialtyName('neurologia'), 'NEUROLOGIA ADULTO');
assert.equal(canonicalSpecialtyName('PSIQ'), 'PSIQUIATRIA');
assert.equal(canonicalSpecialtyName('especialidade futura'), 'especialidade futura');

console.log('Telemedicina: regras de retorno, lembretes e especialidades validadas.');
