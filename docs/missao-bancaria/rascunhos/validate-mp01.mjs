import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { MP01_DRAFT as draft, SOURCES, EDITORIAL } from './mp-01-v1.mjs';
import { PUBLISHED_MISSIONS } from '../../../worker/studies-content/manifest.js';
import { publishedCatalog, validatePublicationCatalog } from '../../../worker/studies-content/publication-registry.js';

const ids = entries => entries.map(entry => entry.id);
const unique = entries => assert.equal(new Set(ids(entries)).size, entries.length);
unique(SOURCES); unique(draft.sections); unique(draft.questions);
assert.equal(draft.publication.status, 'draft');
assert.equal(draft.teaching.contractVersion, 1);
assert.equal(draft.teaching.reviewStatus, 'human-review-pending');
assert.equal(draft.candidateBlockId, 'banking.markets-policy');
assert.equal(draft.xp, undefined);
assert.equal(draft.order, undefined);
assert.deepEqual(validatePublicationCatalog([draft]), []);
assert.deepEqual(ids(publishedCatalog([...PUBLISHED_MISSIONS, draft])), ids(PUBLISHED_MISSIONS));
assert(!PUBLISHED_MISSIONS.some(mission => mission.id === draft.id));
const sources = new Map(SOURCES.map(source => [source.id, source]));
for (const source of SOURCES) {
  assert(['www.gov.br', 'www.bcb.gov.br'].includes(new URL(source.url).hostname));
  assert(source.checkedAt === '2026-09-30' && source.version && source.locator);
}
for (const sourceId of draft.sourceIds) assert(sources.has(sourceId));
const sections = new Map(draft.sections.map(section => [section.id, section]));
for (const type of ['explanation', 'worked-example', 'glossary', 'summary']) assert(draft.sections.some(section => section.type === type));
for (const section of draft.sections) {
  assert(section.id && section.heading.trim() && section.body.trim());
  for (const sourceId of section.sourceIds) assert(sources.has(sourceId));
}
const objectives = new Set([EDITORIAL.recovery.objectiveId]);
let rationales = 0;
for (const question of draft.questions) {
  assert(question.prompt && question.explanation);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length);
  assert.equal(question.optionRationales.length, question.options.length);
  assert(question.optionRationales.every(text => text.trim()));
  rationales += question.optionRationales.length;
  const refs = draft.teaching.questionCoverage[question.id];
  assert(refs.length && question.recoverySectionIds.length);
  for (const ref of refs) assert(ref.missionId === draft.id && sections.has(ref.sectionId));
  for (const id of question.recoverySectionIds) assert(sections.has(id));
  for (const objective of question.objectiveIds) objectives.add(objective);
}
assert.deepEqual([...objectives].sort(), ['O1', 'O2', 'O3', 'O4', 'O5', 'O6']);
assert.deepEqual(Object.keys(draft.teaching.questionCoverage).sort(), ids(draft.questions).sort());

// Uma única fonte editorial; a versão legível é gerada e conferida, nunca editada em paralelo.
let markdown = `# MP-01 — ${draft.title}\n\n**Rascunho para revisão, não publicado.** ${EDITORIAL.stage}.\n\nFonte editorial: [mp-01-v1.mjs](mp-01-v1.mjs). Regenerar com \`node docs/missao-bancaria/rascunhos/validate-mp01.mjs --render\`.\n\nObjetivo: ${draft.objective}\n\n`;
for (const section of draft.sections) {
  markdown += `<a id="${section.id}"></a>\n\n## ${section.heading}\n\n${section.body}\n\n`;
  if (section.sourceIds.length) markdown += `Base conceitual: ${section.sourceIds.map(id => { const source = sources.get(id); return `[${source.label}](${source.url})`; }).join('; ')}. Consulta: 30/09/2026.\n\n`;
}
markdown += '## Recordação e recuperação\n\n' + draft.recall.map(text => `- ${text}`).join('\n') + '\n\n';
markdown += '## Prática comentada\n\nTodos os casos são fictícios. Tente responder antes de abrir cada comentário.\n\n';
for (const [index, question] of draft.questions.entries()) {
  markdown += `### Questão ${index + 1}\n\n${question.prompt}\n\n`;
  markdown += question.options.map((text, index) => `${String.fromCharCode(65 + index)}. ${text}`).join('\n\n') + '\n\n';
  markdown += `<details>\n<summary>Resposta e justificativas</summary>\n\n**Resposta: ${String.fromCharCode(65 + question.answer)}.** ${question.explanation}\n\n`;
  markdown += question.optionRationales.map((text, index) => `- **${String.fromCharCode(65 + index)}:** ${text}`).join('\n') + '\n\n';
  markdown += `Para recuperar: ${question.recoverySectionIds.map(id => `[${sections.get(id).heading}](#${id})`).join('; ')}.\n\n</details>\n\n`;
}
markdown += '## Fontes e limites editoriais\n\n' + SOURCES.map(source => `- [${source.label}](${source.url}): ${source.version}; ${source.locator}; consulta ${source.checkedAt}.`).join('\n') + '\n\n';
markdown += EDITORIAL.limits.map(text => `- ${text}`).join('\n') + '\n';
const output = path.join(import.meta.dirname, 'mp-01-v1.md');
if (process.argv.includes('--render')) fs.writeFileSync(output, markdown);
assert.equal(fs.readFileSync(output, 'utf8').replace(/\r\n/g, '\n'), markdown, 'Regenerar a prévia Markdown do rascunho');
const related = ['mp-01-v1.mjs', 'mp-01-v1.md', 'validate-mp01.mjs', '../68-MP01-RASCUNHO-E-REVISAO.md', '../../../PROJECT_STATE.md'];
let localLinks = 0;
for (const relative of related) {
  const file = path.resolve(import.meta.dirname, relative);
  const text = new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(file));
  assert(!text.includes('\uFFFD'));
  if (!file.endsWith('.md')) continue;
  for (const [, target] of text.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^[a-z]+:/i.test(target)) continue;
    const [local, anchor] = target.split('#');
    if (local) assert(fs.existsSync(path.resolve(path.dirname(file), decodeURIComponent(local))), `${relative}: ${target}`);
    else if (anchor) assert(text.includes(`id="${anchor}"`), `${relative}: ${anchor}`);
    localLinks++;
  }
}
console.log(JSON.stringify({ sections: draft.sections.length, workedExamples: draft.sections.filter(section => section.type === 'worked-example').length, questions: draft.questions.length, optionRationales: rationales, objectives: [...objectives].sort(), sources: SOURCES.length, publishedCatalogUnchanged: true, markdownMatchesSource: true, limits: 'Verificação estrutural; não atesta precisão, clareza humana ou homologação do aplicativo.' }, null, 2));
console.log(JSON.stringify({ utf8Files: related.length, localLinks }));
