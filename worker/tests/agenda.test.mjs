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
  assert.match(html, /js\/agenda\.js\?v=20260916-2/);
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


test('sincronização da Agenda usa leitura única e commits em lote para não estourar subrequests', () => {
  const source = read('worker/agenda.js');
  const block = source.slice(
    source.indexOf('async function syncRecords'),
    source.indexOf('async function markRead')
  );
  assert.match(source, /firestoreCommit/);
  assert.match(block, /existingRecords = await listAll\(env\)/);
  assert.match(block, /await commitWrites\(env, writes\)/);
  assert.doesNotMatch(block, /firestoreGet\(/);
  assert.doesNotMatch(block, /firestoreCreate\(/);
  assert.doesNotMatch(block, /firestorePatch\(/);

  const gateway = read('worker/firebase-gateway.js');
  assert.match(gateway, /export async function firestoreCommit/);
  assert.match(gateway, /documents:commit/);
  assert.match(gateway, /500 gravações por commit/);
});


test('sincronizador automático consulta Agendados em segundo plano a cada 15 minutos', () => {
  const source = read('agenda/digsaude-agenda-sync.user.js');
  assert.match(source, /@version\s+1\.1\.1/);
  assert.match(source, /AUTO_INTERVAL_MS = 15 \* 60 \* 1000/);
  assert.match(source, /fetch\(agendadosUrl\(\)/);
  assert.match(source, /credentials: 'include'/);
  assert.match(source, /cache: 'no-store'/);
  assert.match(source, /new DOMParser\(\)/);
  assert.match(source, /Ativar sincronização automática/);
  assert.match(source, /@updateURL\s+https:\/\/regulacaoeldoradoms\.com\.br\/agenda\/digsaude-agenda-sync\.user\.js/);
  assert.doesNotMatch(source, /document\.cookie|localStorage|sessionStorage|csrf|authorization|bearer/i);
});

test('ponte da Agenda permanece aberta e aceita sincronizações repetidas com deduplicação', () => {
  const source = read('js/agenda-sync-bridge.js');
  assert.match(source, /lastSyncId/);
  assert.match(source, /syncId === lastSyncId/);
  assert.match(source, /Sincronização automática conectada/);
  assert.doesNotMatch(source, /window\.close\(/);
  assert.doesNotMatch(source, /completed\s*=\s*true/);
});

test('backend aceita snapshot completo vazio sem aceitar vazio ambíguo', () => {
  const source = read('worker/agenda.js');
  assert.match(source, /verifiedEmptySnapshot/);
  assert.match(source, /declaredComplete && expectedTotal === 0 && rows\.length === 0/);
  assert.match(source, /!rows\.length && !verifiedEmptySnapshot/);
});


test('sincronizador automático usa chip compacto no canto inferior esquerdo após ativação', () => {
  const source = read('agenda/digsaude-agenda-sync.user.js');
  assert.match(source, /WIDGET_ID = 'portal-agenda-sync-widget'/);
  assert.match(source, /'left:18px'/);
  assert.match(source, /'bottom:18px'/);
  assert.match(source, /compactMode \? '⟳' : 'Ativar sync'/);
  assert.match(source, /showDetails/);
  assert.match(source, /mouseenter/);
  assert.match(source, /Verificar agora/);
  assert.doesNotMatch(source, /'right:22px'/);
});


test('visualização da Agenda permanece na lista e recebe borda de visualizado', () => {
  const source = read('js/agenda.js');
  const html = read('agenda/index.html');
  const css = read('css/agenda.css');

  assert.match(source, /scope: 'all'/);
  assert.match(source, /justRead: new Set\(\)/);
  assert.match(source, /record\.unread \? 'is-unread' : \(record\.active \? 'is-read' : ''\)/);
  assert.match(source, /state\.justRead\.add\(record\.sourceId\)/);
  assert.match(source, /record\.active && \(record\.unread \|\| state\.justRead\.has\(record\.sourceId\)\)/);
  assert.match(html, /class="agenda-stat is-active" type="button" data-agenda-scope="all"/);
  assert.match(css, /\.agenda-card\.is-read/);
  assert.match(css, /border-color: #79b7a0/);
});

test('memória de visualização é persistida fora do documento sincronizado', () => {
  const source = read('worker/agenda.js');
  const syncBlock = source.slice(
    source.indexOf('async function syncRecords'),
    source.indexOf('async function migrateEmbeddedReadMemory')
  );
  const markBlock = source.slice(
    source.indexOf('async function markRead'),
    source.indexOf('export function isAgendaApi')
  );

  assert.match(source, /READ_STATE_COLLECTION = 'telemedicine_digsaude_agenda_read_state'/);
  assert.match(source, /readReceiptCollection/);
  assert.match(source, /listReadMemory/);
  assert.match(source, /migrateEmbeddedReadMemory/);
  assert.match(source, /effectiveReadAt/);
  assert.match(markBlock, /firestoreCommit/);
  assert.match(markBlock, /readAt: now/);
  assert.doesNotMatch(markBlock, /readBy:/);
  assert.doesNotMatch(syncBlock, /READ_STATE_COLLECTION/);
});


test('Agenda acompanha somente itens ainda presentes em Agendados por padrão', () => {
  const frontend = read('js/agenda.js');
  const backend = read('worker/agenda.js');
  const html = read('agenda/index.html');

  assert.match(frontend, /if \(!record\.active && !els\.includeInactive\.checked\) return false/);
  assert.match(backend, /if \(complete\) \{/);
  assert.match(backend, /active: false/);
  assert.match(backend, /removedAt: now/);
  assert.match(html, /Mostrar removidos da aba Agendados/);
});
