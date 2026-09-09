import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const baseSource = fs.readFileSync(path.join(repositoryRoot, 'js/telemedicina-justification-v20.js'), 'utf8');
const v27Source = fs.readFileSync(path.join(repositoryRoot, 'js/telemedicina-absence-reason-v27.js'), 'utf8');
const cssSource = fs.readFileSync(path.join(repositoryRoot, 'css/telemedicina-absence-reason-v27.css'), 'utf8');
const indexSource = fs.readFileSync(path.join(repositoryRoot, 'telemedicina/index.html'), 'utf8');

let copiedText = '';
const context = {
  navigator: { clipboard: { writeText: async (value) => { copiedText = value; } } },
  setTimeout: () => 1,
  clearTimeout: () => {}
};
vm.createContext(context);
vm.runInContext(baseSource, context);
vm.runInContext(v27Source, context);

const helper = context.TelemedicineAbsenceReasonV27;
const justification = context.TelemedicineJustification;
assert.ok(helper, 'A camada V27 não foi exposta');
assert.ok(justification, 'O gerador de justificativa não está disponível');
assert.equal(justification.__telemedicineAbsenceReasonV27, true);

const absence = {
  id: 'falta-teste',
  active: true,
  status: 'SOLICITAR',
  patientId: 'paciente-teste',
  specialty: 'PSIQUIATRIA',
  lastConsultationDate: '2026-08-21',
  returnDueDate: '',
  requestedAt: '',
  followupMode: 'absence',
  absence: true,
  resolution: 'FALTA DO PACIENTE',
  absenceReason: 'NÃO PÔDE COMPARECER, TINHA ORTOPEDIA EM DOURADOS',
  notes: 'NÃO PÔDE COMPARECER, TINHA ORTOPEDIA EM DOURADOS'
};

assert.equal(helper.isAbsence(absence), true);
assert.equal(helper.absenceReasonFor(absence), 'NÃO PÔDE COMPARECER, TINHA ORTOPEDIA EM DOURADOS');
assert.equal(
  justification.build(absence),
  'Data da última consulta: 21/08/2026. Nova solicitação de retorno devido ao não comparecimento do paciente no atendimento anterior. Justificativa: NÃO PÔDE COMPARECER, TINHA ORTOPEDIA EM DOURADOS.'
);
assert.doesNotMatch(justification.build(absence), /Previsão de retorno:/);

const regular = {
  ...absence,
  id: 'retorno-teste',
  absence: false,
  followupMode: 'scheduled',
  resolution: 'RET COM 60 DIAS',
  returnDueDate: '2026-10-20',
  absenceReason: '',
  notes: ''
};
assert.match(justification.build(regular), /Previsão de retorno: 20\/10\/2026\./);

const attributes = new Map([['aria-label', 'Copiar justificativa da solicitação']]);
const classes = new Set();
const button = {
  isConnected: true,
  textContent: 'Copiar motivo',
  dataset: {},
  disabled: false,
  getAttribute: (name) => attributes.get(name) || '',
  setAttribute: (name, value) => attributes.set(name, value),
  removeAttribute: (name) => attributes.delete(name),
  classList: {
    add: (...names) => names.forEach((name) => classes.add(name)),
    remove: (...names) => names.forEach((name) => classes.delete(name))
  }
};
assert.equal(await justification.copyFromButton(button, absence), true);
assert.equal(copiedText, justification.build(absence));
assert.equal(button.textContent, 'Copiado');
assert.equal(button.disabled, false);
assert.equal(classes.has('is-copied'), true);

assert.match(v27Source, /data-tm-absence-reason-v27/);
assert.match(v27Source, /Justificativa:/);
assert.match(cssSource, /\.tm-absence-reason-v27/);
assert.match(cssSource, /animation: none !important/);
assert.match(indexSource, /telemedicina-absence-reason-v27\.css\?v=20260909-1/);
assert.match(indexSource, /telemedicina-absence-reason-v27\.js\?v=20260909-1/);
assert.ok(
  indexSource.indexOf('telemedicina-justification-v20.js') < indexSource.indexOf('telemedicina-absence-reason-v27.js'),
  'V27 deve carregar depois do gerador V20'
);
assert.ok(
  indexSource.indexOf('telemedicina-absence-reason-v27.js') < indexSource.indexOf('telemedicina.js'),
  'V27 deve carregar antes do controlador principal para capturar o dashboard'
);

const pictographicCharacter = /[\u2600-\u27BF\u{1F000}-\u{1FAFF}]/u;
assert.doesNotMatch(v27Source, pictographicCharacter);

console.log('Telemedicina Absence Reason V27: OK');
