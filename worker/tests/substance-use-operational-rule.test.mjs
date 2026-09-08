import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const repositoryRoot = new URL('../../', import.meta.url);

function read(path) {
  return fs.readFileSync(new URL(path, repositoryRoot), 'utf8');
}

test('camada prática 1.9 diferencia Psicologia e Psiquiatria no uso de substâncias sem dados de pacientes', () => {
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
  const psychology = guidance.profiles.find((item) => item.id === 'psicologia-digsaude-alcool-drogas');
  const psychiatry = guidance.profiles.find((item) => item.id === 'psiquiatria-digsaude-substancias-estavel');

  assert.equal(guidance.version, '1.9');
  assert.equal(guidance.updatedAt, '08/09/2026');
  assert.ok(psychology);
  assert.ok(psychiatry);
  assert.match(psychology.returns.join(' '), /Psicologia via DigSaúde MS não deve ser solicitada/);
  assert.match(psychiatry.returns.join(' '), /Não considerar o uso de álcool ou outras drogas, por si só, como motivo/);
  assert.match(psychiatry.caseDependent.join(' '), /aceita pacientes em uso de álcool ou outras drogas desde que estejam clinicamente estáveis/);
  assert.match(psychiatry.safety.join(' '), /não constitui indicação de internação hospitalar/);
  assert.doesNotMatch(guidance.methodology.studyHistory.join(' '), /Psiquiatria não recebem pacientes/);
  assert.doesNotMatch(read('js/referral-practice-update-20260908.js'), /\b\d{11,15}\b/);
});

test('Guia Médico carrega a correção operacional depois da regra de TEA', () => {
  const html = read('medico/index.html');
  const previous = html.indexOf('referral-practice-update-20260828.js?v=20260828-1');
  const current = html.indexOf('referral-practice-update-20260908.js?v=20260908-2');
  assert.ok(previous >= 0);
  assert.ok(current > previous);
  assert.ok(current < html.indexOf('medical-app.js?v=20260828-1'));
});

test('Recepção imprime orientação distinta para Psicologia e Psiquiatria', () => {
  const html = read('recepcao/index.html');
  const source = read('js/reception-substance-guidance.js');
  assert.match(html, /reception-substance-guidance\.js\?v=20260908-3/);
  assert.match(source, /Condição operacional — uso de álcool e outras drogas/);
  assert.match(source, /A recepção deve imprimir a orientação abaixo e entregar ao paciente/);
  assert.match(source, /Psiquiatria<\/strong> do DigSaúde MS <strong>aceita pacientes em uso de álcool ou outras drogas quando estão clinicamente estáveis/);
  assert.match(source, /A recepção não faz avaliação clínica de estabilidade/);
  assert.match(source, /teleconsulta de <strong>Psicologia<\/strong> do DigSaúde MS não recebe demandas relacionadas ao uso de álcool ou outras drogas/);
  assert.match(source, /if \(existing\) return/);
  assert.doesNotMatch(source, /Psicologia e Psiquiatria<\/strong> não recebe/);
  assert.doesNotMatch(source, /\b(?:CPF|CNS|telefone do paciente|nome do paciente)\b/i);
});
