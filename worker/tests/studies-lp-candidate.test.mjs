import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { LP_PLAN, loadLpEditorial, compileLpCandidate } from '../scripts/studies-lp-candidate.mjs';
import { PUBLISHED_MISSIONS, STUDY_SOURCES, missionById, validateTeachingCatalog } from '../studies-content/manifest.js';
import { publishedCatalog } from '../studies-content/publication-registry.js';
import { DP_MISSIONS, DP_SOURCES } from '../studies-content/banking-digital-payments-v1.js';
import { IS_MISSIONS, IS_SOURCES } from '../studies-content/banking-institution-specific-v1.js';
import { LP_MISSIONS, LP_SOURCES } from '../studies-content/portuguese-reading-v1.js';

const editorial = await loadLpEditorial();
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const baselineHash = hash({ missions: PUBLISHED_MISSIONS, sources: STUDY_SOURCES, dp: DP_MISSIONS });
const candidate = compileLpCandidate(editorial);

test('proveniência identifica autoria local sem atribuir autoridade externa', () => {
  assert.equal(candidate.sources.length, 5);
  for (const [index, source] of candidate.sources.entries()) {
    assert.equal(source.provenance, 'project-authored');
    assert.equal(source.remoteArtifactAvailable, false);
    assert.equal(source.locator, `docs/missao-bancaria/rascunhos/lp-${LP_PLAN[index].unit.slice(2)}-v1.mjs`);
    assert.match(source.label, /rascunho local/);
    assert.equal(candidate.missions[index].sourceIds[0], source.id);
  }
});

test('LP fica draft sem exposição ou mudança do catálogo/progresso ativo', () => {
  assert.equal(candidate.status, 'draft');
  assert.equal(candidate.missions.length, 5);
  assert(candidate.missions.every(m => m.publication.status === 'draft' && m.candidate.parametersApproved === false));
  assert.deepEqual(publishedCatalog([...PUBLISHED_MISSIONS, ...DP_MISSIONS, ...IS_MISSIONS, ...candidate.missions]), PUBLISHED_MISSIONS);
  for (const mission of candidate.missions) assert.equal(missionById(mission.id), null);
  assert.equal(hash({ missions: PUBLISHED_MISSIONS, sources: STUDY_SOURCES, dp: DP_MISSIONS }), baselineHash);
});

test('artefato preserva texto, gabaritos, justificativas e recuperações editoriais', () => {
  assert.deepEqual(LP_MISSIONS, candidate.missions);
  assert.deepEqual(LP_SOURCES, candidate.sources);
  assert.deepEqual(validateTeachingCatalog([...PUBLISHED_MISSIONS, ...DP_MISSIONS, ...IS_MISSIONS, ...candidate.missions], [...STUDY_SOURCES, ...DP_SOURCES, ...IS_SOURCES, ...candidate.sources]), []);
  for (let i = 0; i < editorial.length; i++) {
    const draft = editorial[i].draft, compiled = candidate.missions[i];
    assert.equal(compiled.candidate.blockId, 'portuguese.reading');
    for (let j = 0; j < draft.sections.length; j++) assert.equal(compiled.sections[j].body, draft.sections[j].body);
    for (let j = 0; j < draft.questions.length; j++) {
      const original = draft.questions[j], question = compiled.questions[j];
      assert.equal(question.id, `q.${original.id}`);
      assert.equal(question.prompt, original.prompt);
      assert.deepEqual(question.options, original.options);
      assert.equal(question.answer, original.answer);
      assert.equal(question.explanation, original.explanation);
      assert.deepEqual(question.optionRationales, original.optionRationales);
      assert(compiled.teaching.questionCoverage[question.id].length);
    }
  }
});

test('sequência proposta depende do Chefe DP sem aprovar parâmetros', () => {
  for (const [i, mission] of candidate.missions.entries()) {
    assert.equal(mission.order, i + 65);
    assert.equal(mission.candidate.prerequisiteId, i ? candidate.missions[i - 1].id : 'banking.dp.boss');
    assert.equal(mission.xp, mission.kind === 'boss' ? 220 : 100);
    assert.equal(mission.passScore, mission.kind === 'boss' ? 75 : 0);
    assert.equal(mission.candidate.parametersApproved, false);
  }
  assert.equal(LP_PLAN[0].prerequisiteId, DP_MISSIONS.at(-1).id);
});

test('Chefe tem itens próprios com ensino de todas as três aulas', () => {
  const boss = editorial.at(-1).draft;
  const exposed = new Set([...PUBLISHED_MISSIONS, ...editorial.slice(0, -1).map(e => e.draft)].flatMap(m => m.questions.map(q => q.prompt)));
  assert.equal(boss.questions.length, 12);
  assert.equal(new Set(boss.questions.map(q => q.prompt)).size, 12);
  assert(boss.questions.every(q => !exposed.has(q.prompt)));
  assert.deepEqual([...new Set(boss.questions.flatMap(q => q.originRefs.map(ref => ref.unit)))].sort(), LP_PLAN.slice(0, 3).map(p => p.unit));
});

test('rejeita pacote incompleto, duplicado ou editorial ativado', () => {
  assert.throws(() => compileLpCandidate(editorial.slice(1)), /cinco unidades/);
  assert.throws(() => compileLpCandidate([...editorial.slice(1), editorial[1]]), /cinco unidades/);
  const changed = structuredClone(editorial);
  changed[0].draft.publication.status = 'published';
  assert.throws(() => compileLpCandidate(changed), /origem deve permanecer draft/);
});

test('rejeita fonte ou seção de recuperação desconhecida', () => {
  const changed = structuredClone(editorial);
  changed[0].draft.sourceIds.push('fonte.inexistente');
  assert.throws(() => compileLpCandidate(changed), /fonte desconhecida/);
  const broken = structuredClone(editorial);
  broken.at(-1).draft.questions[0].originRefs[0].sectionId = 'secao-inexistente';
  assert.throws(() => compileLpCandidate(broken), /broken-teaching-reference/);
});

test('rejeita recuperação que dependa de aula futura', () => {
  const changed = structuredClone(editorial);
  changed[0].draft.questions[0].originRefs = [{ unit: 'lp03', sectionId: 'assunto' }];
  assert.throws(() => compileLpCandidate(changed), /future-prerequisite/);
});

test('LP: seis cenários de roteador real em SQLite offline, sem ativação', () => {
  const env = { ...process.env }; delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--experimental-vm-modules', '--test', '--test-reporter=tap', fileURLToPath(new URL('./helpers/studies-lp-route-runner.mjs', import.meta.url))], { env, encoding: 'utf8', timeout: 15000, maxBuffer: 1024 * 1024 });
  assert.equal(result.status, 0, result.stdout + '\n' + result.stderr);
  assert.match(result.stdout, /# pass 6\b/); assert.match(result.stdout, /# fail 0\b/);
  assert(candidate.missions.every(m => m.publication.status === 'draft' && m.candidate.parametersApproved === false));
});
