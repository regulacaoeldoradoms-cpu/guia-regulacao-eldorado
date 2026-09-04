import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const repositoryRoot = new URL('../../', import.meta.url);

function read(path) {
  return fs.readFileSync(new URL(path, repositoryRoot), 'utf8');
}

test('camada prática 1.7 registra a restrição sem identificadores de paciente', () => {
  const context = { window: {} };
  vm.createContext(context);

  for (const path of [
    'js/referral-practice-data.js',
    'js/referral-practice-update-20260804.js',
    'js/referral-practice-update-20260804-2.js',
    'js/referral-practice-update-20260804-3.js',
    'js/referral-practice-update-20260804-4.js',
    'js/referral-practice-update-20260805.js',
    'js/referral-practice-update-20260811.js',
    'js/referral-practice-update-20260828.js'
  ]) vm.runInContext(read(path), context, { filename: path });

  const guidance = context.window.REFERRAL_PRACTICE_GUIDANCE;
  const profile = guidance.profiles.find((item) => item.id === 'psicologia-digsus-tea');
  assert.equal(guidance.version, '1.7');
  assert.equal(guidance.updatedAt, '28/08/2026');
  assert.ok(profile);
  assert.match(profile.returns.join(' '), /Psicologia via DigSaúde MS/);
  assert.match(profile.caseDependent.join(' '), /específica da teleconsulta de Psicologia/);
  assert.doesNotMatch(read('js/referral-practice-update-20260828.js'), /\b\d{11,15}\b/);
});

test('interfaces profissional e médica aplicam a mesma atualização operacional', () => {
  for (const path of ['js/app.js', 'js/medical-app.js']) {
    const source = read(path);
    assert.match(source, /isPsychology/);
    assert.match(source, /não aceita pacientes com TEA\/autismo/);
    assert.match(source, /Confirmação operacional do suporte DigSaúde MS/);
    assert.match(source, /updated\.ultimaConferencia = '28\/08\/2026'/);
  }

  const medicalHtml = read('medico/index.html');
  assert.match(medicalHtml, /referral-practice-update-20260828\.js/);
  assert.match(medicalHtml, /medical-app\.js\?v=20260828-1/);
  assert.match(medicalHtml, /ai-assistant\.js\?v=20260904-2/);
});

test('assistente prioriza Psicologia e fornece resposta local determinística', () => {
  const source = read('js/ai-assistant.js');
  assert.match(source, /digsus-psicologia-tea/);
  assert.match(source, /score \+= 100/);
  assert.match(source, /operationalFacts: context\.operationalFacts/);
  assert.match(source, /Não\. Conforme confirmação operacional do suporte do DigSaúde MS em 28\/08\/2026/);
  assert.match(source, /não significa que todo o DigSaúde recuse pacientes com TEA/);
});
