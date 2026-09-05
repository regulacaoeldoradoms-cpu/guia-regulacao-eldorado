import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const source = fs.readFileSync(path.join(repositoryRoot, 'js/telemedicina-justification-v20.js'), 'utf8');
let copiedText = '';
const context = {
  navigator: { clipboard: { writeText: async (value) => { copiedText = value; } } },
  setTimeout: () => 1,
  clearTimeout: () => {}
};
vm.createContext(context);
vm.runInContext(source, context);

const justification = context.TelemedicineJustification;
assert.ok(justification, 'O gerador V20 não foi exposto');

const base = {
  id: 'acompanhamento-teste',
  active: true,
  status: 'SOLICITAR',
  lastConsultationDate: '2026-08-06',
  returnDueDate: '2026-10-05',
  requestedAt: ''
};

assert.equal(
  justification.build({ ...base, resolution: 'RET COM 60 DIAS' }),
  'Data da última consulta: 06/08/2026. Retorno solicitado pela especialidade após 60 dias. Previsão de retorno: 05/10/2026.'
);

assert.equal(
  justification.build({ ...base, resolution: 'RETORNO APÓS EXAMES', returnConditionType: 'exams' }),
  'Data da última consulta: 06/08/2026. Retorno solicitado para apresentar os exames solicitados. Previsão de retorno: 05/10/2026.'
);

assert.equal(
  justification.reasonFor({ resolution: 'RETORNO APÓS EXAMES - RESSONÂNCIA DA COLUNA', returnConditionType: 'exams', returnConditionDetail: 'Ressonância da coluna' }),
  'Retorno solicitado para apresentar os exames solicitados: ressonância da coluna.'
);
assert.equal(justification.reasonFor({ resolution: 'RETORNO APOS FISIO' }), 'Retorno solicitado após a conclusão das sessões de fisioterapia.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO APÓS PROCEDIMENTO OU CIRURGIA' }), 'Retorno solicitado após a realização do procedimento ou cirurgia indicada.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO APÓS CONCLUSÃO DO TRATAMENTO' }), 'Retorno solicitado após a conclusão do tratamento indicado.');
assert.equal(
  justification.reasonFor({ resolution: 'RETORNO COM 3 MESES APÓS TRATAMENTO' }),
  'Retorno solicitado após a conclusão do tratamento indicado, no prazo de 3 meses.'
);
assert.equal(
  justification.reasonFor({ resolution: 'RETORNO APÓS MELHORA CLÍNICA', returnConditionType: 'other', returnConditionDetail: 'Melhora clínica' }),
  'Retorno solicitado após o cumprimento da condição registrada: melhora clínica.'
);
assert.equal(justification.reasonFor({ resolution: 'RETORNO SE NECESSARIO' }), 'Retorno solicitado pela especialidade conforme necessidade clínica registrada.');
assert.equal(justification.reasonFor({ resolution: 'ACOMPANHAMENTO SEM DATA DEFINIDA' }), 'Retorno solicitado pela especialidade para continuidade do acompanhamento.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO PROGRAMADO PARA 05/10/2026' }), 'Retorno solicitado pela especialidade para reavaliação na data indicada.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO EM 1 SEMANA' }), 'Retorno solicitado pela especialidade após 1 semana.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO EM 1 MES' }), 'Retorno solicitado pela especialidade após 1 mês.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO EM 2 ANOS' }), 'Retorno solicitado pela especialidade após 2 anos.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO APÓS AVALIAÇÃO DA EQUIPE' }), 'Retorno solicitado após avaliação da equipe.');

assert.equal(justification.isAvailable(base), true);
assert.equal(justification.isAvailable({ ...base, status: 'ATRASADO' }), true);
for (const status of ['EM AGUARDO', 'SEM PROGRAMAÇÃO', 'SOLICITADO', 'CONCLUÍDO']) {
  assert.equal(justification.isAvailable({ ...base, status }), false, `Ação não pode aparecer em ${status}`);
}
assert.equal(justification.isAvailable({ ...base, requestedAt: '2026-09-05' }), false);
assert.equal(justification.isAvailable({ ...base, requestedHistorical: true }), false);
assert.equal(justification.isAvailable({ ...base, active: false }), false);

const classes = new Set();
const attributes = new Map([['aria-label', 'Copiar justificativa da solicitação']]);
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
assert.equal(await justification.copyFromButton(button, { ...base, resolution: 'RET COM 60 DIAS' }), true);
assert.equal(copiedText, justification.build({ ...base, resolution: 'RET COM 60 DIAS' }));
assert.equal(button.textContent, 'Copiado');
assert.equal(button.disabled, false);
assert.equal(classes.has('is-copied'), true);

const pictographicCharacter = /[\u2600-\u27BF\u{1F000}-\u{1FAFF}]/u;
assert.doesNotMatch(source, pictographicCharacter);

console.log('Telemedicina Justificativa V20: textos, estados e cópia validados.');
