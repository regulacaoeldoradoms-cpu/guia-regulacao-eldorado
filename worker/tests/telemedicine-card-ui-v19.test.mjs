import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

const html = read('telemedicina/index.html');
const css = read('css/telemedicina-cards-v19.css');
const desktop = read('js/telemedicina.js');
const mobile = read('js/telemedicina-mobile-v9.js');
const viewSwitch = read('js/telemedicina-mobile-v7.js');
const edit = read('js/telemedicina-edit.js');
const documentation = read('docs/TELEMEDICINA-CARDS-V19.md');

assert.match(html, /telemedicina-cards-v19\.css\?v=20260905-1/);
assert.match(html, /data-followup-cards="v19"/);
assert.match(html, /telemedicina\.js\?v=20260905-1/);
assert.match(html, /telemedicina-mobile-v7\.js\?v=20260905-1/);
assert.match(html, /telemedicina-mobile-v9\.js\?v=20260905-1/);
assert.match(html, /telemedicina-edit\.js\?v=20260905-1/);

for (const source of [desktop, mobile]) {
  assert.match(source, /function reminderMarkup\(item\)/);
  assert.match(source, /class="telemedicine-reminder-chip"/);
  assert.match(source, /class="telemedicine-reminder-number"/);
  assert.match(source, /data-status="\$\{escapeHtml\(statusClass\(item\.status\)\)\}"/);
  assert.match(source, /telemedicine-zone-label telemedicine-condition-label/);
  assert.match(source, /data-action="schedule"/);
  assert.match(source, /data-action="requested"/);
  assert.match(source, /data-action="patient"/);
}

assert.match(mobile, /row\.dataset\.status = statusClass\(item\.status\)/);
assert.match(mobile, /reminders\.outerHTML = reminderMarkup\(item\)/);
assert.match(viewSwitch, /if \(view === 'list'\) return 'Lista'/);
assert.doesNotMatch(viewSwitch, /[☰▦]/u);
assert.match(edit, /stroke="currentColor"/);
assert.match(edit, /stroke-linecap="round"/);

for (const state of ['em-aguardo', 'solicitar', 'atrasado', 'sem-programacao', 'solicitado']) {
  assert.ok(css.includes(`[data-status="${state}"]`), `Atmosfera ausente para ${state}`);
  assert.ok(css.includes(`.telemedicine-status.${state}`), `Selo ausente para ${state}`);
}

for (const action of ['schedule', 'requested', 'patient']) {
  assert.ok(css.includes(`[data-action="${action}"]`), `Icone/acao ausente para ${action}`);
}

assert.match(css, /telemedicine-workspace/);
assert.match(css, /telemedicine-reminders/);
assert.match(css, /mask-image:/);
assert.match(css, /prefers-reduced-motion: reduce/);
assert.doesNotMatch(css, /(?:linear|radial|conic)-gradient\(/);
assert.match(documentation, /quatro zonas/);
assert.match(documentation, /nenhuma alteração nos arquivos de backend/);

const runtimeSources = [html, desktop, mobile, viewSwitch, edit, css];
const pictographicCharacter = /[\u2600-\u27BF\u{1F000}-\u{1FAFF}]/u;
for (const source of runtimeSources) assert.doesNotMatch(source, pictographicCharacter);

const openingBraces = (css.match(/\{/g) || []).length;
const closingBraces = (css.match(/\}/g) || []).length;
assert.equal(openingBraces, closingBraces, 'A folha V19 possui chaves CSS desequilibradas');

console.log('Telemedicina Cards V19: estrutura, estados, vetores e acessibilidade validados.');
