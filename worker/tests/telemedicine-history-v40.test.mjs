import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const html = read('telemedicina/index.html');
const history = read('js/telemedicina-history-v40.js');
const css = read('css/telemedicina-history-v40.css');
const desktop = read('js/telemedicina.js');
const mobile = read('js/telemedicina-mobile-v9.js');
const docs = read('docs/TELEMEDICINA.md');

assert.match(html, /telemedicina-history-v40\.css\?v=20260924-dark-final-1/);
assert.match(html, /telemedicina-history-v40\.js\?v=20260914-1/);
assert.match(html, /data-history-design="v40"/);
assert.match(html, /telemedicina\.js\?v=20260922-1/);
assert.match(html, /telemedicina-mobile-v9\.js\?v=20260921-1/);

for (const token of ['orderedEvents', 'Mais recente', 'Linha do tempo', 'Situação atual', 'Falta registrada', 'Alta registrada', 'Solicitação registrada', 'Retorno programado', 'Situação atualizada', 'Acompanhamento encerrado', 'tm-history-rail', 'tm-history-marker']) {
  assert.ok(history.includes(token), `Elemento ausente no renderizador V40: ${token}`);
}

assert.match(desktop, /historyRenderer\.render\(\{ followups, events, inline: false \}\)/);
assert.match(mobile, /historyRenderer\.render\(\{ followups, events, inline: true \}\)/);

for (const token of ['scrollbar-gutter:stable', 'position:sticky', '.tm-history-event.tone-absence', '.tm-history-event.tone-discharge', '.tm-history-event.tone-schedule', '.tm-history-current-card.status-concluido', 'prefers-reduced-motion:reduce']) {
  assert.ok(css.includes(token), `Regra visual ausente no CSS V40: ${token}`);
}

assert.match(docs, /Histórico longitudinal visual V40/);
assert.match(docs, /somente apresentação/);
assert.match(docs, /Mais recente/);
assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length, 'CSS V40 com chaves desequilibradas');

console.log('Telemedicina Histórico V40 validado.');
