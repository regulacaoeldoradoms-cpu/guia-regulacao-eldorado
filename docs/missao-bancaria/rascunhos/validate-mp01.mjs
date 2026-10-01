import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PUBLISHED_MISSIONS } from '../../../worker/studies-content/manifest.js';
import { publishedCatalog, validatePublicationCatalog } from '../../../worker/studies-content/publication-registry.js';

const unit = process.argv.find(arg => arg.startsWith('--unit='))?.split('=')[1] || 'mp01';
assert(['mp01', 'mp02', 'mp03', 'mp04', 'mp05', 'mp06', 'mp07', 'mp08', 'mp09', 'mpr', 'mpchefe', 'pc01a', 'pc01', 'pc02', 'pc03', 'pc04', 'pc05', 'pc06', 'pc08', 'pc09', 'pc10', 'pc11a', 'pc11b', 'pc11c', 'pc11d', 'pc11e', 'pcr', 'pcchefe', 'ce01', 'ce02', 'ce03', 'ce04', 'ce05', 'ce06', 'ce07', 'ce08', 'ce09', 'ce10', 'ce11', 'cer', 'cechefe'].includes(unit), 'Unidade editorial desconhecida');
const isCE = unit.startsWith('ce');
const sourceDate = isCE ? '2026-10-01' : '2026-09-30';
const isBoss = ['mpchefe', 'pcchefe', 'cechefe'].includes(unit);
const stem = `${unit.slice(0, 2)}-${unit.slice(2)}-v1`;
const content = await import(`./${stem}.mjs`);
const { SOURCES, EDITORIAL } = content;
const draft = content[`${unit.toUpperCase()}_DRAFT`];
const unitFlag = unit === 'mp01' ? '' : ` --unit=${unit}`;

const ids = entries => entries.map(entry => entry.id);
const unique = entries => assert.equal(new Set(ids(entries)).size, entries.length);
unique(SOURCES); unique(draft.sections); unique(draft.questions);
assert.equal(draft.publication.status, 'draft');
assert.equal(draft.teaching.contractVersion, 1);
assert.equal(draft.teaching.reviewStatus, 'human-review-pending');
assert.equal(draft.candidateBlockId, isCE ? 'banking.capital-exchange' : unit.startsWith('pc') ? 'banking.products-credit' : 'banking.markets-policy');
assert.equal(draft.xp, undefined);
assert.equal(draft.order, undefined);
assert.deepEqual(validatePublicationCatalog([draft]), []);
assert.deepEqual(ids(publishedCatalog([...PUBLISHED_MISSIONS, draft])), ids(PUBLISHED_MISSIONS));
assert(!PUBLISHED_MISSIONS.some(mission => mission.id === draft.id));
const sources = new Map(SOURCES.map(source => [source.id, source]));
for (const source of SOURCES) {
  assert(['www.gov.br', 'www.bcb.gov.br', 'normativos.bcb.gov.br', 'www.caixa.gov.br', 'www.ecb.europa.eu', 'www.planalto.gov.br', 'www.bankofengland.co.uk', ...(isCE ? ['conteudo.cvm.gov.br', 'www.imf.org'] : [])].includes(new URL(source.url).hostname));
  const reusedTransmission = isCE && source.id === 'bcb.ce.transmissao' && source.checkedAt === '2026-09-30';
  assert((source.checkedAt === sourceDate || reusedTransmission) && source.version && source.locator);
}
for (const sourceId of draft.sourceIds) assert(sources.has(sourceId));
const sections = new Map(draft.sections.map(section => [section.id, section]));
for (const type of ['explanation', 'worked-example', 'glossary', 'summary']) assert(draft.sections.some(section => section.type === type));
for (const section of draft.sections) {
  assert(section.id && section.heading.trim() && section.body.trim());
  for (const sourceId of section.sourceIds) assert(sources.has(sourceId));
}
const objectives = new Set([EDITORIAL.recovery.objectiveId]);
const originLabels = new Map();
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
  for (const ref of refs) {
    if (ref.missionId === draft.id) assert(sections.has(ref.sectionId));
    else assert(isBoss && question.originRefs?.some(origin => ref.missionId === `draft.${origin.unit}` && ref.sectionId === origin.sectionId), `${question.id}: cobertura externa não declarada`);
  }
  for (const id of question.recoverySectionIds) assert(sections.has(id));
  for (const objective of question.objectiveIds) objectives.add(objective);
  if (isBoss || ['mpr', 'pcr', 'cer'].includes(unit)) assert(question.originRefs?.length, 'Revisão/Chefe requer aula de origem por questão');
  for (const ref of question.originRefs || []) {
    assert(isCE ? /^ce(0[1-9]|1[01])$/.test(ref.unit) : unit.startsWith('pc') ? /^pc(01a|0[1-6]|0[89]|10|11[a-e])$/.test(ref.unit) : /^mp(0[1-9]|r)$/.test(ref.unit));
    const origin = await import(`./${ref.unit.slice(0, 2)}-${ref.unit.slice(2)}-v1.mjs`);
    const originDraft = origin[`${ref.unit.toUpperCase()}_DRAFT`];
    const originSection = originDraft.sections.find(section => section.id === ref.sectionId);
    assert(originSection, `${question.id}: origem ausente`);
    if (isBoss) assert(refs.some(coverage => coverage.missionId === originDraft.id && coverage.sectionId === ref.sectionId), `${question.id}: origem ausente da cobertura`);
    originLabels.set(`${ref.unit}:${ref.sectionId}`, `${originDraft.editorialKey}: ${originSection.heading}`);
  }
}
assert.deepEqual([...objectives].sort(), ['O1', 'O2', 'O3', 'O4', 'O5', 'O6']);
assert.deepEqual(Object.keys(draft.teaching.questionCoverage).sort(), ids(draft.questions).sort());
if (isCE && !isBoss) assert.equal(draft.questions.length, 8);
if (unit === 'cer') assert.deepEqual([...new Set(draft.questions.flatMap(q => q.originRefs.map(ref => ref.unit)))].sort(), Array.from({ length: 11 }, (_, i) => `ce${String(i + 1).padStart(2, '0')}`));
if (isBoss) {
  assert.equal(draft.kind, 'boss');
  assert.equal(draft.questions.length, 12);
  assert.equal(EDITORIAL.groups.length, 6);
  unique(EDITORIAL.groups);
  for (const group of EDITORIAL.groups) {
    const questions = draft.questions.filter(q => q.groupId === group.id);
    assert.equal(questions.length, 2, group.id);
    const taughtUnits = new Set(questions.flatMap(q => q.originRefs.map(ref => ref.unit)));
    assert.deepEqual([...taughtUnits].sort(), [...group.units].sort(), `${group.id}: dependência de ensino`);
  }
}
for (const calculation of content.ARITHMETIC || []) {
  assert.equal(calculation.values.length, 2);
  assert(calculation.values.every(Number.isFinite));
  assert(['add', 'subtract', 'multiply', 'divide'].includes(calculation.operation));
  const [left, right] = calculation.values;
  if (calculation.operation === 'divide') assert.notEqual(right, 0);
  const result = { add: () => left + right, subtract: () => left - right, multiply: () => left * right, divide: () => left / right }[calculation.operation]();
  assert(Math.abs(result - calculation.expected) < 1e-12, calculation.label);
}

// Uma única fonte editorial; a versão legível é gerada e conferida, nunca editada em paralelo.
let markdown = `# ${draft.editorialKey} — ${draft.title}\n\n**Rascunho para revisão, não publicado.** ${EDITORIAL.stage}.\n\nFonte editorial: [${stem}.mjs](${stem}.mjs). Regenerar com \`node docs/missao-bancaria/rascunhos/validate-mp01.mjs${unitFlag} --render\`.\n\nObjetivo: ${draft.objective}\n\n`;
for (const section of draft.sections) {
  markdown += `<a id="${section.id}"></a>\n\n## ${section.heading}\n\n${section.body}\n\n`;
  if (section.sourceIds.length) markdown += `Base conceitual: ${section.sourceIds.map(id => { const source = sources.get(id); return `[${source.label}](${source.url})`; }).join('; ')}. Consulta: ${[...new Set(section.sourceIds.map(id => sources.get(id).checkedAt))].map(date => date.split('-').reverse().join('/')).join('; ')}.\n\n`;
}
markdown += '## Recordação e recuperação\n\n' + draft.recall.map(text => `- ${text}`).join('\n') + '\n\n';
markdown += '## Prática comentada\n\nTodos os casos são fictícios. Tente responder antes de abrir cada comentário.\n\n';
for (const [index, question] of draft.questions.entries()) {
  markdown += `### Questão ${index + 1}\n\n${question.prompt}\n\n`;
  markdown += question.options.map((text, index) => `${String.fromCharCode(65 + index)}. ${text}`).join('\n\n') + '\n\n';
  markdown += `<details>\n<summary>Resposta e justificativas</summary>\n\n**Resposta: ${String.fromCharCode(65 + question.answer)}.** ${question.explanation}\n\n`;
  markdown += question.optionRationales.map((text, index) => `- **${String.fromCharCode(65 + index)}:** ${text}`).join('\n') + '\n\n';
  markdown += `Para recuperar: ${question.recoverySectionIds.map(id => `[${sections.get(id).heading}](#${id})`).join('; ')}.\n\n</details>\n\n`;
  if (question.originRefs?.length) markdown += `Aula de origem: ${question.originRefs.map(ref => `[${originLabels.get(`${ref.unit}:${ref.sectionId}`)}](${ref.unit.slice(0, 2)}-${ref.unit.slice(2)}-v1.md#${ref.sectionId})`).join('; ')}.\n\n`;
}
markdown += '## Fontes e limites editoriais\n\n' + SOURCES.map(source => `- [${source.label}](${source.url}): ${source.version}; ${source.locator}; consulta ${source.checkedAt}.`).join('\n') + '\n\n';
markdown += EDITORIAL.limits.map(text => `- ${text}`).join('\n') + '\n';
const output = path.join(import.meta.dirname, `${stem}.md`);
if (process.argv.includes('--render')) fs.writeFileSync(output, markdown);
assert.equal(fs.readFileSync(output, 'utf8').replace(/\r\n/g, '\n'), markdown, 'Regenerar a prévia Markdown do rascunho');
const review = unit === 'ce01' ? '../80-CE-PLANO-E-PRIMEIRA-UNIDADE.md' : { mp01: '../68-MP01-RASCUNHO-E-REVISAO.md', mp02: '../69-MP02-RASCUNHO-E-REVISAO.md', mp03: '../70-MP03-RASCUNHO-E-REVISAO.md', mpchefe: '../72-MP-CHEFE-RASCUNHO-E-REVISAO.md', pc01a: '../74-PC01A-RASCUNHO-E-REVISAO.md', pc04: '../76-PC04-05-RASCUNHOS-E-REVISAO.md', pc05: '../76-PC04-05-RASCUNHOS-E-REVISAO.md', pcr: '../78-PC-REVISAO-E-PROPOSTA-CHEFE.md', pcchefe: '../78-PC-REVISAO-E-PROPOSTA-CHEFE.md' }[unit] || (['pc06', 'pc08', 'pc09', 'pc10', 'pc11a', 'pc11b', 'pc11c', 'pc11d', 'pc11e'].includes(unit) ? '../77-PC-CONJUNTO-COMUM-RASCUNHOS.md' : unit.startsWith('pc') ? '../75-PC01-03-RASCUNHOS-E-REVISAO.md' : '../71-MP-BLOCO-RASCUNHO-E-REVISAO.md');
const ceReview = ['cer', 'cechefe'].includes(unit) ? '../82-CE-REVISAO-E-PROPOSTA-CHEFE.md' : '../81-CE-CONJUNTO-RASCUNHOS.md';
const related = [`${stem}.mjs`, `${stem}.md`, 'validate-mp01.mjs', isCE && unit !== 'ce01' ? ceReview : review, '../../../PROJECT_STATE.md'];
let localLinks = 0;
for (const relative of related) {
  const file = path.resolve(import.meta.dirname, relative);
  const text = new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(file));
  assert(!text.includes('\uFFFD'));
  if (!file.endsWith('.md')) continue;
  for (const [, target] of text.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^[a-z]+:/i.test(target)) continue;
    const [local, anchor] = target.split('#');
    if (local) {
      const targetFile = path.resolve(path.dirname(file), decodeURIComponent(local));
      assert(fs.existsSync(targetFile), `${relative}: ${target}`);
      if (anchor && /(?:mp-(?:0[1-9]|r|chefe)|pc-(?:01a|0[1-6]|0[89]|10|11[a-e]|r|chefe)|ce-(?:0[1-9]|1[01]|r|chefe))-v1\.md$/.test(targetFile)) {
        assert(fs.readFileSync(targetFile, 'utf8').includes(`id="${anchor}"`), `${relative}: origem ${target}`);
      }
    }
    else if (anchor) assert(text.includes(`id="${anchor}"`), `${relative}: ${anchor}`);
    localLinks++;
  }
}
console.log(JSON.stringify({ unit, sections: draft.sections.length, workedExamples: draft.sections.filter(section => section.type === 'worked-example').length, questions: draft.questions.length, optionRationales: rationales, objectives: [...objectives].sort(), sources: SOURCES.length, arithmeticChecks: (content.ARITHMETIC || []).length, publishedCatalogUnchanged: true, markdownMatchesSource: true, limits: 'Verificação estrutural; não atesta precisão, clareza humana ou homologação do aplicativo.' }, null, 2));
console.log(JSON.stringify({ utf8Files: related.length, localLinks }));
