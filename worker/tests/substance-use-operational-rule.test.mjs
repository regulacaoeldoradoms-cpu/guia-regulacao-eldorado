import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const repositoryRoot = new URL('../../', import.meta.url);

function read(path) {
  return fs.readFileSync(new URL(path, repositoryRoot), 'utf8');
}

test('camada prática 1.8 registra regra operacional de álcool e outras drogas sem dados de pacientes', () => {
  const context = {
    window: {
      REFERRAL_PRACTICE_GUIDANCE: {
        version: '1.7',
        updatedAt: '28/08/2026',
        methodology: { scope: '', sourceLabel: '', studyHistory: [], responsePolicy: [] },
        profiles: []
      }
    }
  };
  vm.createContext(context);
  vm.runInContext(read('js/referral-practice-update-20260908.js'), context, {
    filename: 'js/referral-practice-update-20260908.js'
  });

  const guidance = context.window.REFERRAL_PRACTICE_GUIDANCE;
  const profile = guidance.profiles.find((item) => item.id === 'saude-mental-digsaude-alcool-drogas');
  assert.equal(guidance.version, '1.8');
  assert.equal(guidance.updatedAt, '08/09/2026');
  assert.ok(profile);
  assert.match(profile.returns.join(' '), /Psicologia ou Psiquiatria/);
  assert.match(profile.returns.join(' '), /álcool ou outras drogas/);
  assert.match(profile.caseDependent.join(' '), /mais restritiva que o texto formal da Psiquiatria/);
  assert.match(profile.safety.join(' '), /não constitui, isoladamente, indicação de internação hospitalar/);
  assert.doesNotMatch(read('js/referral-practice-update-20260908.js'), /\b\d{11,15}\b/);
});

test('Guia Médico carrega a atualização operacional depois da regra de TEA', () => {
  const html = read('medico/index.html');
  const previous = html.indexOf('referral-practice-update-20260828.js?v=20260828-1');
  const current = html.indexOf('referral-practice-update-20260908.js?v=20260908-1');
  assert.ok(previous >= 0);
  assert.ok(current > previous);
  assert.ok(current < html.indexOf('medical-app.js?v=20260828-1'));
});

test('Recepção oferece condição operacional e impressão própria para Psicologia e Psiquiatria', () => {
  const html = read('recepcao/index.html');
  const source = read('js/reception-substance-guidance.js');
  assert.match(html, /reception-substance-guidance\.js\?v=20260908-1/);
  assert.match(source, /Condição operacional — uso de álcool e outras drogas/);
  assert.match(source, /A recepção deve imprimir a orientação abaixo e entregar ao paciente/);
  assert.match(source, /Psicologia e Psiquiatria/);
  assert.match(source, /não significa, por si só, necessidade de internação hospitalar/);
  assert.doesNotMatch(source, /\b(?:CPF|CNS|telefone do paciente|nome do paciente)\b/i);
});
