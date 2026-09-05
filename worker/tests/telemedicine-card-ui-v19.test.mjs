import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (relativePath) => fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8');

const html = read('telemedicina/index.html');
const css = read('css/telemedicina-cards-v19.css');
const desktop = read('js/telemedicina.js');
const mobile = read('js/telemedicina-mobile-v9.js');
const justification = read('js/telemedicina-justification-v20.js');
const viewSwitch = read('js/telemedicina-mobile-v7.js');
const edit = read('js/telemedicina-edit.js');
const documentation = read('docs/TELEMEDICINA-CARDS-V19.md');
const justificationDocumentation = read('docs/TELEMEDICINA-JUSTIFICATIVA-V20.md');

assert.match(html, /telemedicina-cards-v19\.css\?v=20260905-4/);
assert.match(html, /data-followup-cards="v19"/);
assert.match(html, /data-copy-justification="v20"/);
assert.match(html, /telemedicina-justification-v20\.js\?v=20260905-1/);
assert.match(html, /telemedicina\.js\?v=20260905-2/);
assert.match(html, /telemedicina-mobile-v7\.js\?v=20260905-1/);
assert.match(html, /telemedicina-mobile-v9\.js\?v=20260905-2/);
assert.match(html, /telemedicina-edit\.js\?v=20260905-1/);

for (const source of [desktop, mobile]) {
  assert.match(source, /function reminderMarkup\(item\)/);
  assert.match(source, /class="telemedicine-reminder-chip"/);
  assert.match(source, /class="telemedicine-reminder-number"/);
  assert.match(source, /data-status="\$\{escapeHtml\(statusClass\(item\.status\)\)\}"/);
  assert.match(source, /telemedicine-zone-label telemedicine-condition-label/);
  assert.match(source, /data-action="schedule"/);
  assert.match(source, /data-action="requested"/);
  assert.match(source, /data-action="copy-justification"/);
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

for (const action of ['schedule', 'requested', 'copy-justification', 'patient']) {
  assert.ok(css.includes(`[data-action="${action}"]`), `Icone/acao ausente para ${action}`);
}

assert.match(css, /\.telemedicine-actions \[data-action\]::before\s*\{[\s\S]*?position: static !important;[\s\S]*?inset: auto !important;/);
assert.doesNotMatch(css, /\[data-followup-cards="v19"\][^{]*\[data-action="requested"\]::before\s*\{[^}]*position:\s*absolute/);

assert.match(css, /telemedicine-workspace/);
assert.match(css, /telemedicine-reminders/);
assert.match(css, /mask-image:/);
assert.match(css, /--tm-v19-icon-copy:/);
assert.match(css, /prefers-reduced-motion: reduce/);
assert.match(css, /\.tm-view-list \.telemedicine-row > \.telemedicine-specialty-block\s*\{[\s\S]*?grid-template-columns: minmax\(0, 1fr\) !important/);
assert.match(css, /\.tm-view-grid \.telemedicine-patient > button\[data-action="patient"\]\s*\{[\s\S]*?overflow-wrap: normal !important/);
assert.match(css, /\.telemedicine-actions \.portal-button\s*\{[\s\S]*?grid-column: 1 \/ -1 !important;[\s\S]*?width: 100% !important/);
assert.match(css, /\.tm-view-grid \.telemedicine-row\s*\{[\s\S]*?align-items: stretch !important/);
assert.match(css, /\.tm-view-grid \.telemedicine-row > \.telemedicine-patient,[\s\S]*?\.tm-view-grid \.telemedicine-row > \.telemedicine-actions\s*\{[\s\S]*?width: 100% !important;[\s\S]*?align-self: stretch !important/);
assert.match(css, /\.tm-view-grid \.telemedicine-actions\s*\{[\s\S]*?grid-template-columns: minmax\(0, 1fr\) !important;[\s\S]*?justify-items: stretch !important/);
assert.match(css, /\.tm-view-list \.telemedicine-actions\s*\{[\s\S]*?display: flex !important;[\s\S]*?flex-wrap: nowrap !important/);
assert.match(css, /\.tm-view-list \.telemedicine-actions \.portal-button\s*\{[\s\S]*?flex: 1 1 0 !important/);
assert.doesNotMatch(css, /(?:linear|radial|conic)-gradient\(/);
assert.match(documentation, /quatro zonas/);
assert.match(documentation, /nenhuma alteração nos arquivos de backend/);
assert.match(justificationDocumentation, /`SOLICITAR` ou permanece pendente em `ATRASADO`/);
assert.match(justificationDocumentation, /Data da última consulta/);

const runtimeSources = [html, desktop, mobile, justification, viewSwitch, edit, css];
const pictographicCharacter = /[\u2600-\u27BF\u{1F000}-\u{1FAFF}]/u;
for (const source of runtimeSources) assert.doesNotMatch(source, pictographicCharacter);

const openingBraces = (css.match(/\{/g) || []).length;
const closingBraces = (css.match(/\}/g) || []).length;
assert.equal(openingBraces, closingBraces, 'A folha V19 possui chaves CSS desequilibradas');

console.log('Telemedicina Cards V19: estrutura, estados, vetores e acessibilidade validados.');
