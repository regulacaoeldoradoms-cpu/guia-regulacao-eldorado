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
assert.equal(justification.reasonFor({ resolution: 'RETORNO APÓS PROCEDIMENTO' }), 'Retorno solicitado após a realização do procedimento ou cirurgia indicada.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO APÓS CIRURGIA' }), 'Retorno solicitado após a realização da cirurgia indicada.');
assert.equal(
  justification.reasonFor({ resolution: 'RETORNO APÓS PROCEDIMENTO OU CIRURGIA', returnConditionType: 'procedure' }),
  'Retorno solicitado após a realização do procedimento ou cirurgia indicada.'
);
assert.equal(justification.reasonFor({ resolution: 'RETORNO APÓS CONCLUSÃO DO TRATAMENTO' }), 'Retorno solicitado após a conclusão do tratamento indicado.');
assert.equal(
  justification.reasonFor({ resolution: 'RETORNO COM 3 MESES APÓS TRATAMENTO' }),
  'Retorno solicitado após a conclusão do tratamento indicado, no prazo de 3 meses.'
);
assert.equal(
  justification.reasonFor({ resolution: 'RETORNO APÓS MELHORA CLÍNICA', returnConditionType: 'other', returnConditionDetail: 'Melhora clínica' }),
  'Retorno solicitado após melhora clínica.'
);
assert.equal(justification.reasonFor({ resolution: 'RETORNO SE NECESSARIO' }), 'Retorno solicitado pela especialidade conforme necessidade clínica registrada.');
assert.equal(justification.reasonFor({ resolution: 'ACOMPANHAMENTO SEM DATA DEFINIDA' }), 'Retorno solicitado pela especialidade para continuidade do acompanhamento.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO PROGRAMADO PARA 05/10/2026' }), 'Retorno solicitado pela especialidade para reavaliação na data indicada.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO EM 1 SEMANA' }), 'Retorno solicitado pela especialidade após 1 semana.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO EM 1 MES' }), 'Retorno solicitado pela especialidade após 1 mês.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO EM 2 ANOS' }), 'Retorno solicitado pela especialidade após 2 anos.');
assert.equal(justification.reasonFor({ resolution: 'RETORNO APÓS AVALIAÇÃO DA EQUIPE' }), 'Retorno solicitado após avaliação da equipe.');

const clinicalCases = [
  ['RETORNO APÓS RESSONÂNCIA DA COLUNA', 'Retorno solicitado para apresentar o resultado do exame de imagem solicitado: ressonância da coluna.'],
  ['RET APÓS RNM DA COLUNA', 'Retorno solicitado para apresentar o resultado do exame de imagem solicitado: rnm da coluna.'],
  ['RETORNO APÓS EXAMES LABORATORIAIS', 'Retorno solicitado para apresentar os resultados dos exames laboratoriais solicitados.'],
  ['RET APÓS TTO', 'Retorno solicitado após a conclusão do tratamento indicado.'],
  ['RETORNO APÓS TERAPIA OCUPACIONAL', 'Retorno solicitado após a conclusão das sessões de terapia ocupacional.'],
  ['RETORNO APÓS FONOAUDIOLOGIA', 'Retorno solicitado após a conclusão das sessões de fonoaudiologia.'],
  ['RETORNO APÓS PSICOTERAPIA', 'Retorno solicitado após o período de acompanhamento em psicoterapia.'],
  ['RETORNO APÓS REABILITAÇÃO', 'Retorno solicitado após a conclusão do período de reabilitação indicado.'],
  ['RETORNO APÓS INFILTRAÇÃO', 'Retorno solicitado após a realização do procedimento indicado: infiltração.'],
  ['RETORNO PÓS-OPERATÓRIO', 'Retorno solicitado para reavaliação pós-operatória.'],
  ['RETORNO APÓS AJUSTE DA MEDICAÇÃO', 'Retorno solicitado após o período de uso ou ajuste da medicação indicada.'],
  ['RETORNO APÓS EVOLUÇÃO CLÍNICA', 'Retorno solicitado após evolução clínica.'],
  ['RETORNO APÓS PARECER DO ESPECIALISTA', 'Retorno solicitado após parecer do especialista.'],
  ['RETORNO PARA APRESENTAR LAUDO', 'Retorno solicitado para apresentar o laudo, relatório ou documento solicitado.'],
  ['RETORNO PARA APRESENTAR PERFIL GLICÊMICO', 'Retorno solicitado para apresentar os registros de monitoramento solicitados: apresentar perfil glicêmico.'],
  ['RETORNO APÓS ALTA HOSPITALAR', 'Retorno solicitado após a alta hospitalar.'],
  ['RETORNO DEPOIS DE LIBERAÇÃO DA EQUIPE', 'Retorno solicitado após liberação da equipe.'],
  ['CONDUTA ATÍPICA REGISTRADA', 'Retorno solicitado conforme a conduta registrada na última consulta: CONDUTA ATÍPICA REGISTRADA.'],
  ['', 'Retorno solicitado pela especialidade para continuidade do acompanhamento na data prevista.']
];
for (const [resolution, expected] of clinicalCases) {
  assert.equal(justification.reasonFor({ resolution }), expected, resolution || 'conduta vazia');
}

const operationalCases = [
  ['FALTOU SEM JUSTIFICAR', 'absence-unjustified', 'Nova solicitação de retorno devido à ausência não justificada do paciente no atendimento anterior.'],
  ['FALTA JUSTIFICADA', 'absence-justified', 'Nova solicitação de retorno devido à ausência justificada do paciente no atendimento anterior.'],
  ['PCT NÃO COMPARECEU', 'absence', 'Nova solicitação de retorno devido ao não comparecimento do paciente no atendimento anterior.'],
  ['PACIENTE SOLICITOU REAGENDAMENTO', 'patient-reschedule', 'Nova solicitação de retorno para reagendamento, conforme pedido do paciente.'],
  ['CANCELAMENTO PELO ESPECIALISTA', 'specialist-cancellation', 'Nova solicitação de retorno devido ao cancelamento ou à indisponibilidade do especialista no atendimento anterior.'],
  ['CONSULTA CANCELADA', 'service-cancellation', 'Nova solicitação de retorno devido ao cancelamento do atendimento anterior pelo serviço responsável.'],
  ['ERRO NO SISTEMA - SOLICITADO NOVO RETORNO', 'system-failure', 'Nova solicitação de retorno porque o atendimento anterior foi prejudicado por falha do sistema.'],
  ['FALHA DE CONEXÃO NO TELEATENDIMENTO', 'connection-failure', 'Nova solicitação de retorno porque o teleatendimento anterior foi prejudicado por falha de conexão.'],
  ['SOLICITAR NOVAMENTE, NÃO CONCLUÍDO', 'incomplete-appointment', 'Nova solicitação de retorno porque o teleatendimento anterior não foi concluído.'],
  ['SOLICITAÇÃO DEVOLVIDA', 'request-returned', 'Nova solicitação de retorno porque a solicitação anterior foi devolvida.'],
  ['PEDIDO INDEFERIDO', 'request-denied', 'Nova solicitação de retorno porque a solicitação anterior foi indeferida.'],
  ['RETORNO CANCELADO', 'request-cancelled', 'Nova solicitação de retorno porque a solicitação anterior foi cancelada.'],
  ['SOLICITAÇÃO EXPIRADA', 'request-expired', 'Nova solicitação de retorno porque a solicitação anterior perdeu a validade.'],
  ['PACIENTE ESQUECEU SOLICITAR NOVO RETORNO', 'request-not-made', 'Nova solicitação de retorno porque o pedido anterior não foi realizado dentro do prazo previsto.'],
  ['PACIENTE PERDEU O SEGUIMENTO', 'lost-followup', 'Nova solicitação de retorno para restabelecer o acompanhamento após perda de seguimento.'],
  ['PACIENTE INCOMUNICÁVEL', 'patient-unreachable', 'Nova solicitação de retorno após o restabelecimento do contato com o paciente.'],
  ['REMARCAR RETORNO', 'reschedule', 'Nova solicitação de retorno para reagendamento do atendimento, conforme o registro operacional.']
];
for (const [notes, category, expected] of operationalCases) {
  const item = { resolution: 'RETORNO PROGRAMADO PARA 05/10/2026', notes };
  assert.equal(justification.operationalCategory(item), category, notes);
  assert.equal(justification.reasonFor(item), expected, notes);
}

assert.equal(
  justification.reasonFor({ resolution: 'RETORNO PROGRAMADO PARA 05/10/2026', notes: 'Retorno após cicatrização completa' }),
  'Retorno solicitado após cicatrização completa.'
);
assert.equal(
  justification.reasonFor({ resolution: 'RETORNO PROGRAMADO PARA 05/10/2026', notes: 'Solicitar após avaliação odontológica' }),
  'Retorno solicitado conforme a conduta registrada na última consulta: Solicitar após avaliação odontológica.'
);
assert.equal(
  justification.reasonFor({ resolution: 'ACOMPANHAMENTO SEM DATA DEFINIDA', notes: 'Solicitar após avaliação odontológica' }),
  'Retorno solicitado conforme a conduta registrada na última consulta: Solicitar após avaliação odontológica.'
);
assert.equal(
  justification.reasonFor({ resolution: 'RET COM 60 DIAS', notes: 'PCT N COMPARECEU' }),
  'Nova solicitação de retorno devido ao não comparecimento do paciente no atendimento anterior. O retorno foi indicado pela especialidade após 60 dias.'
);
assert.equal(
  justification.reasonFor({ resolution: 'RET COM 45 DIAS', notes: 'CONSULTA NÃO CONCLUÍDA POR PROBLEMA DE INTERNET' }),
  'Nova solicitação de retorno porque o teleatendimento anterior foi prejudicado por falha de conexão. O retorno foi indicado pela especialidade após 45 dias.'
);

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
