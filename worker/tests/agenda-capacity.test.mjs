import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function read(path) {
  return fs.readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
}

function capacityRules() {
  const window = {};
  vm.runInNewContext(read('js/agenda-capacity.js'), { window });
  return window.AgendaCapacity;
}

test('detecta capacidade excedida em janela direta de até 30 minutos', () => {
  const rules = capacityRules();
  const records = [
    { sourceId: 'a', active: true, appointmentDate: '2026-09-22', appointmentTime: '08:00', patient: 'A', specialty: 'Psicólogo' },
    { sourceId: 'b', active: true, appointmentDate: '2026-09-22', appointmentTime: '08:15', patient: 'B', specialty: 'Nutricionista' },
    { sourceId: 'c', active: true, appointmentDate: '2026-09-22', appointmentTime: '08:30', patient: 'C', specialty: 'Médico Endocrinologista' }
  ];

  const result = rules.analyze(records);
  assert.equal(result.roomCapacity, 2);
  assert.equal(result.windowMinutes, 30);
  assert.equal(result.criticalGroups.length, 1);
  assert.equal(result.criticalGroups[0].records.length, 3);
  assert.equal(result.occupancyBySourceId.a, 3);
  assert.equal(result.occupancyBySourceId.c, 3);
});

test('não cria conflito transitivo entre 08:00 e 09:00', () => {
  const rules = capacityRules();
  const records = [
    { sourceId: 'a', active: true, appointmentDate: '2026-09-22', appointmentTime: '08:00', patient: 'A', specialty: 'Psicólogo' },
    { sourceId: 'b', active: true, appointmentDate: '2026-09-22', appointmentTime: '08:30', patient: 'B', specialty: 'Nutricionista' },
    { sourceId: 'c', active: true, appointmentDate: '2026-09-22', appointmentTime: '09:00', patient: 'C', specialty: 'Médico Endocrinologista' }
  ];

  const result = rules.analyze(records);
  assert.equal(result.criticalGroups.length, 0);
  assert.equal(result.occupancyBySourceId.a, 2);
  assert.equal(result.occupancyBySourceId.b, 2);
  assert.equal(result.occupancyBySourceId.c, 2);
});

test('Psiquiatria fica fora do cálculo das duas salas', () => {
  const rules = capacityRules();
  const records = [
    { sourceId: 'a', active: true, appointmentDate: '2026-09-22', appointmentTime: '07:30', patient: 'A', specialty: 'Psicólogo' },
    { sourceId: 'b', active: true, appointmentDate: '2026-09-22', appointmentTime: '07:30', patient: 'B', specialty: 'Nutricionista' },
    { sourceId: 'p', active: true, appointmentDate: '2026-09-22', appointmentTime: '07:30', patient: 'P', specialty: 'Médico Psiquiatra' }
  ];

  const result = rules.analyze(records);
  assert.equal(rules.isPsychiatry(records[2]), true);
  assert.equal(result.criticalGroups.length, 0);
  assert.equal(result.occupancyBySourceId.a, 2);
  assert.equal(result.occupancyBySourceId.b, 2);
  assert.equal(result.occupancyBySourceId.p, undefined);
});

test('interface prepara alerta e WhatsApp sem envio automático', () => {
  const html = read('agenda/index.html');
  const source = read('js/agenda.js');

  assert.match(html, /id="agendaCapacitySection"/);
  assert.match(html, /js\/agenda-capacity\.js\?v=20260916-1/);
  assert.match(source, /WHATSAPP_SUPPORT_NUMBER = '556781631815'/);
  assert.match(source, /Olá, identificamos conflito de horários nas teleconsultas de Eldorado\/MS/);
  assert.match(source, /record\.patient/);
  assert.match(source, /record\.specialty/);
  assert.match(source, /record\.appointmentTime/);
  assert.match(source, /https:\/\/wa\.me\//);
  assert.match(source, /Abrir WhatsApp do suporte/);
  assert.doesNotMatch(html, /portal-observability|posthog|umami/i);
});


test('cards com 2 de 2 salas recebem destaque amarelo completo', () => {
  const source = read('js/agenda.js');
  const css = read('css/agenda.css');
  const html = read('agenda/index.html');

  assert.match(source, /occupancy === state\.capacity\.roomCapacity \? 'is-capacity-full' : ''/);
  assert.match(css, /\.agenda-card\.is-capacity-full/);
  assert.match(css, /background: #fff2ad/);
  assert.match(css, /border-color: #e0a400/);
  assert.match(html, /css\/agenda\.css\?v=20260916-5/);
  assert.match(html, /js\/agenda\.js\?v=20260916-3\.2/);
});
