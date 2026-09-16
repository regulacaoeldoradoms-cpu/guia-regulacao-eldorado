import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function read(path) {
  return fs.readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
}

function toolsCatalog() {
  const window = {
    RegulationAuth: { hasCouncilAccess() { return false; } }
  };
  vm.runInNewContext(read('js/tools-catalog.js'), { window });
  return window.PortalTools;
}

test('Agenda aparece somente para Telemedicina e Desenvolvedor', () => {
  const tools = toolsCatalog();
  const ids = (user) => tools.cardsFor({ emailVerified: true, ...user }).map((card) => card.id);

  assert.ok(ids({ role: 'telemedicina' }).includes('agenda'));
  assert.ok(ids({ role: 'admin' }).includes('agenda'));
  assert.ok(!ids({ role: 'recepcao' }).includes('agenda'));
  assert.ok(!ids({ role: 'medico' }).includes('agenda'));
  assert.ok(!ids({ role: 'coordenacao' }).includes('agenda'));
  assert.ok(!ids({ role: 'cidadao' }).includes('agenda'));
});

test('backend da Agenda exige sessão e capacidade Telemedicina', () => {
  const source = read('worker/agenda.js');
  assert.match(source, /validatePortalSession/);
  assert.match(source, /telemedicineAccessFor/);
  assert.match(source, /Acesso exclusivo da Telemedicina ou do Desenvolvedor/);
  assert.match(source, /Cache-Control': 'no-store'/);
  assert.match(source, /\/api\/agenda\/sync/);
  assert.match(source, /\/api\/agenda\/read/);
  assert.doesNotMatch(source, /console\.(log|info|warn|error)/);
});

test('Agenda não carrega observabilidade em uma tela que contém nomes de pacientes', () => {
  const html = read('agenda/index.html');
  assert.match(html, /Agenda DigSaúde/);
  assert.match(html, /js\/agenda\.js\?v=20260916-1/);
  assert.doesNotMatch(html, /portal-observability|posthog|umami/i);
  assert.doesNotMatch(html, /portal-performance\.js/);
});

test('sincronizador lê somente a tabela Agendados e não extrai credenciais', () => {
  const source = read('agenda/digsaude-agenda-sync.user.js');
  assert.match(source, /fi-ta-row/);
  assert.match(source, /\.table\.records\./);
  assert.match(source, /Agendados/);
  assert.match(source, /postMessage/);
  assert.doesNotMatch(source, /document\.cookie|localStorage|sessionStorage|csrf|authorization|bearer/i);
});

test('ponte aceita mensagens somente da origem oficial do DigSaúde', () => {
  const source = read('js/agenda-sync-bridge.js');
  assert.match(source, /https:\/\/teleatendimento\.saude\.ms\.gov\.br/);
  assert.match(source, /event\.origin !== DIGSAUDE_ORIGIN/);
  assert.match(source, /event\.source !== window\.opener/);
  assert.match(source, /RegulationAuth/);
});
