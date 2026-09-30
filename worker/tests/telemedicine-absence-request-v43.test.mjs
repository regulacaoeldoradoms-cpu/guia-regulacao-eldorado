import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deriveFollowupStatus } from '../telemedicine-rules.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const pendingAbsence = {
  active: true,
  followupMode: 'absence',
  absence: true,
  absenceNeedsRequest: true,
  absencePendingRequest: true,
  returnDueDate: '',
  reminderDates: [],
  requestedAt: ''
};

assert.equal(deriveFollowupStatus(pendingAbsence, '2026-09-30'), 'SOLICITAR');
assert.equal(
  deriveFollowupStatus({
    ...pendingAbsence,
    active: false,
    absenceNeedsRequest: false,
    absencePendingRequest: false
  }, '2026-09-30'),
  'CONCLUÍDO'
);

const legacyWorker = read('worker/telemedicine.js');
const atomicWorker = read('worker/telemedicine-router-v2.js');
const absenceUi = read('js/telemedicina-absence-v24.js');
const desktop = read('js/telemedicina.js');
const mobile = read('js/telemedicina-mobile-v9.js');
const absenceCss = read('css/telemedicina-absence-v24.css');
const html = read('telemedicina/index.html');
const documentation = read('docs/TELEMEDICINA-FALTA-SOLICITACAO-V43.md');

for (const worker of [legacyWorker, atomicWorker]) {
  assert.match(worker, /absenceNeedsRequest/);
  assert.match(worker, /absencePendingRequest: absence && absenceNeedsRequest/);
  assert.match(worker, /absence \? absenceNeedsRequest : !discharged/);
}

assert.match(legacyWorker, /absencePendingRequest: absenceNeedsRequest/);
assert.match(legacyWorker, /active: absenceNeedsRequest/);
assert.match(legacyWorker, /typeof input\.absenceNeedsRequest === 'boolean'/);

assert.match(absenceUi, /absenceRequestMarkup\('consultAbsenceRequest'/);
assert.match(absenceUi, /absenceRequestMarkup\('absenceNeedsRequest'/);
assert.match(absenceUi, /name="\$\{name\}" value="yes"/);
assert.match(absenceUi, /name="\$\{name\}" value="no"/);
assert.match(absenceUi, /Informe se a falta deve gerar uma nova solicitação/);

assert.match(desktop, /body\.absenceNeedsRequest = requestChoice\.value === 'yes'/);
assert.match(desktop, /absenceNeedsRequest,/);
assert.match(mobile, /absenceNeedsRequest,/);
assert.match(mobile, /input\[name="absenceNeedsRequest"\]:checked/);

assert.match(absenceCss, /#outcomeEditModal \.tm-absence-request-option/);
assert.match(absenceCss, /input\[type="radio"\][\s\S]*width: 18px !important/);
assert.match(absenceCss, /#outcomeEditModal #outcomeEditAbsence[\s\S]*background: #351f2a !important/);
assert.match(absenceCss, /#outcomeEditModal \.tm-absence-request-option\.yes:has\(input:checked\)/);
assert.match(absenceCss, /#outcomeEditModal \.tm-absence-request-option\.no:has\(input:checked\)/);

assert.match(html, /data-absence-request="v43"/);
assert.match(documentation, /Solicitar novamente/);
assert.match(documentation, /Não solicitar novamente/);
assert.match(documentation, /clientes antigos/i);

console.log('Telemedicina Falta com solicitação opcional V43: OK');
