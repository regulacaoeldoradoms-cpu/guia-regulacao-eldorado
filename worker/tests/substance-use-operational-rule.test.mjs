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

test('Recepção oferece impressão condicional apenas onde há regra apoiada em fonte', () => {
  const html = read('recepcao/index.html');
  const source = read('js/reception-substance-guidance.js');
  const css = read('css/reception.css');

  assert.match(html, /reception-substance-guidance\.js\?v=20260908-5/);
  assert.match(source, /ORIENTAÇÃO CONDICIONAL — FLUXO DIGSAÚDE MS/);
  assert.match(source, /Imprimir orientação condicional/);
  assert.match(source, /reception-conditional-print/);
  assert.match(css, /\.reception-conditional-print\s*\{/);
  assert.match(css, /#c62828/);
  assert.match(css, /#b71c1c/);

  for (const specialty of [
    'endocrinologia adulto', 'geriatria', 'hematologia adulto', 'infectologia',
    'neurologia adulto', 'nefrologia adulto', 'neuropediatria', 'nutricao',
    'obstetricia', 'ortopedia adulto', 'otorrinolaringologia', 'pediatria',
    'pneumologia adulto', 'psicologia', 'psiquiatria adulto', 'reumatologia adulto'
  ]) {
    assert.match(source, new RegExp(specialty.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }

  assert.doesNotMatch(source, /aliases:\s*\[[^\]]*'dermatologia geral'/i);
  assert.doesNotMatch(source, /aliases:\s*\[[^\]]*'enfermagem em cuidados paliativos'/i);
  assert.doesNotMatch(source, /aliases:\s*\[[^\]]*'odontologia - estomatologia'/i);
});

test('orientações condicionais preservam as regras clínicas mais sensíveis sem atribuir avaliação à recepção', () => {
  const source = read('js/reception-substance-guidance.js');

  assert.match(source, /LDL ≥ 190 mg\/dL.*excluir hipotireoidismo/s);
  assert.match(source, /IMC ≥ 30 kg\/m² após falha de tratamento clínico com nutricionista/);
  assert.match(source, /ITU recorrente.*após exclusão de causas anatômicas urológicas ou ginecológicas/s);
  assert.match(source, /alteração anatômica do trato urinário.*Urologia/s);
  assert.match(source, /convulsão febril simples/);
  assert.match(source, /Síncope ou perda transitória de consciência/);
  assert.match(source, /síncope vasovagal usualmente não necessitam avaliação/);
  assert.match(source, /Vertigem com suspeita de origem central.*após avaliação em serviço de emergência/s);
  assert.match(source, /otite externa maligna após o manejo na emergência/);
  assert.match(source, /cerume obstrutivo/);
  assert.match(source, /luxação recorrente de ombro após avaliação em serviço de emergência/);
  assert.match(source, /arboviroses.*pacientes estáveis/is);
  assert.match(source, /endocardite infecciosa.*pacientes estáveis/is);

  assert.match(source, /cardiopatas, nefropatas, pacientes bariátricos ou em processo bariátrico/);
  assert.match(source, /transtornos alimentares como anorexia e bulimia/);
  assert.match(source, /indivíduos em uso de insulinoterapia/);

  assert.match(source, /dificuldades de aprendizagem; avaliações psicológicas/);
  assert.match(source, /Transtorno do Espectro Autista \(TEA\)/);
  assert.match(source, /alterações comportamentais devido ao uso de substâncias psicoativas/);
  assert.match(source, /transtornos mentais graves com risco iminente/);

  assert.match(source, /Psiquiatria quando estão clinicamente estáveis/);
  assert.match(source, /uso de substâncias, isoladamente, não é motivo de exclusão nem indicação automática de internação/);
  assert.match(source, /A recepção não avalia estabilidade/);
  assert.match(source, /A recepção apenas entrega a orientação e não realiza avaliação clínica/);
  assert.match(source, /A recepção não diagnostica, não classifica risco, não interpreta exames e não define estabilidade/);
});

test('orientação condicional não contém dados identificáveis de pacientes', () => {
  const source = read('js/reception-substance-guidance.js');
  assert.doesNotMatch(source, /\b(?:CPF|CNS|telefone do paciente|nome do paciente|Nome da Mãe|Código da Solicitação)\b/i);
  assert.doesNotMatch(source, /\b\d{11,15}\b/);
});
