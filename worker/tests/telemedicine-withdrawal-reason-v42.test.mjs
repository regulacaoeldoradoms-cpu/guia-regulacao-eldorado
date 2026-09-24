import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function read(path) {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

const outcomes = read('js/telemedicina-absence-v24.js');
const desktop = read('js/telemedicina.js');
const mobile = read('js/telemedicina-mobile-v9.js');
const legacyWorker = read('worker/telemedicine.js');
const atomicWorker = read('worker/telemedicine-router-v2.js');
const html = read('telemedicina/index.html');

assert.match(outcomes, /Motivo da desistência/);
assert.match(outcomes, /Opcional\. Este motivo ficará registrado no histórico\./);
assert.match(outcomes, /Informe o motivo, se desejar/);
assert.match(outcomes, /const withdrawn = mode === WITHDRAWN_MODE;/);
assert.match(outcomes, /const hideAll = closed && !absence && !withdrawn;/);
assert.match(outcomes, /notesField\.hidden = \(closed && !withdrawn\) \|\| absence;/);
assert.match(outcomes, /const keepWithdrawalReason = withdrawn && field === notesField;/);
assert.match(outcomes, /detailLabel\.textContent !== 'Motivo:'/);

const withdrawalAdapter = outcomes.slice(
  outcomes.indexOf('if (mode === WITHDRAWN_MODE)'),
  outcomes.indexOf('} else if (mode === IN_PERSON_MODE)')
);
assert.match(withdrawalAdapter, /resolution: WITHDRAWN_RESOLUTION/);
assert.doesNotMatch(withdrawalAdapter, /notes:\s*''/);

for (const worker of [legacyWorker, atomicWorker]) {
  assert.match(worker, /const withdrawn = normalizeText\(inputResolution\) === 'PACIENTE DESISTIU DO TRATAMENTO';/);
  assert.match(worker, /const notes = discharged && !withdrawn \? '' : inputNotes;/);
}

assert.match(desktop, /const discharged = followupMode === 'discharge';/);
assert.match(desktop, /notes: discharged \? '' : document\.getElementById\('consultNotes'\)\.value\.trim\(\)/);
assert.match(mobile, /const discharged = followupMode === 'discharge';/);
assert.match(mobile, /notes: discharged \? '' : form\.elements\.notes\.value\.trim\(\)/);

assert.match(html, /data-withdrawal-reason="v42"/);
assert.match(html, /telemedicina-absence-v24\.js\?v=20260924-1/);

console.log('Telemedicina Motivo da Desistência V42: OK');
