import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { OA_PLAN, loadOaEditorial, compileOaCandidate } from '../scripts/studies-oa-candidate.mjs';
import { PUBLISHED_MISSIONS, STUDY_SOURCES, missionById, validateTeachingCatalog } from '../studies-content/manifest.js';
import { publishedCatalog } from '../studies-content/publication-registry.js';
import { DP_MISSIONS, DP_SOURCES } from '../studies-content/banking-digital-payments-v1.js';
import { IS_MISSIONS, IS_SOURCES } from '../studies-content/banking-institution-specific-v1.js';
import { LP_MISSIONS, LP_SOURCES } from '../studies-content/portuguese-reading-v1.js';
import { PT_MISSIONS, PT_SOURCES } from '../studies-content/portuguese-text-v1.js';
import { OA_MISSIONS, OA_SOURCES } from '../studies-content/portuguese-accentuation-v1.js';

const editorial = await loadOaEditorial();
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const baselineHash = hash({ missions: PUBLISHED_MISSIONS, sources: STUDY_SOURCES, dp: DP_MISSIONS, is: IS_MISSIONS, lp: LP_MISSIONS, pt: PT_MISSIONS });
const candidate = compileOaCandidate(editorial);

test('fonte normativa primária é explícita e conserva o locator por unidade', () => {
  assert.equal(candidate.sources.length, 6);
  for (const [index, source] of candidate.sources.entries()) {
    assert.equal(new URL(source.url).hostname, 'www.planalto.gov.br');
    assert.equal(source.checkedAt, '2026-10-04');
    assert.equal(source.locator, editorial[index].sources[0].locator);
    assert.match(source.version, /6\.583/);
    assert.equal(candidate.missions[index].sourceIds[0], source.id);
  }
});

test('OA fica draft sem exposição ou mudança do catálogo/progresso ativo', () => {
  assert.equal(candidate.status, 'draft');
  assert.equal(candidate.missions.length, 6);
  assert(candidate.missions.every(m => m.publication.status === 'draft' && m.candidate.parametersApproved === false));
  assert.deepEqual(publishedCatalog([...PUBLISHED_MISSIONS, ...DP_MISSIONS, ...IS_MISSIONS, ...LP_MISSIONS, ...PT_MISSIONS, ...candidate.missions]), PUBLISHED_MISSIONS);
  for (const mission of candidate.missions) assert.equal(missionById(mission.id), null);
  assert.equal(hash({ missions: PUBLISHED_MISSIONS, sources: STUDY_SOURCES, dp: DP_MISSIONS, is: IS_MISSIONS, lp: LP_MISSIONS, pt: PT_MISSIONS }), baselineHash);
});

test('artefato preserva texto, gabaritos, justificativas e recuperações editoriais', () => {
  assert.deepEqual(OA_MISSIONS, candidate.missions);
  assert.deepEqual(OA_SOURCES, candidate.sources);
  assert.deepEqual(validateTeachingCatalog([...PUBLISHED_MISSIONS, ...DP_MISSIONS, ...IS_MISSIONS, ...LP_MISSIONS, ...PT_MISSIONS, ...candidate.missions], [...STUDY_SOURCES, ...DP_SOURCES, ...IS_SOURCES, ...LP_SOURCES, ...PT_SOURCES, ...candidate.sources]), []);
  for (let i = 0; i < editorial.length; i++) {
    const draft = editorial[i].draft, compiled = candidate.missions[i];
    assert.equal(compiled.candidate.blockId, 'portuguese.spelling');
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

test('sequência proposta depende do Chefe PT sem aprovar parâmetros', () => {
  for (const [i, mission] of candidate.missions.entries()) {
    assert.equal(mission.order, i + 86);
    assert.equal(mission.candidate.prerequisiteId, i ? candidate.missions[i - 1].id : 'portuguese.text.boss');
    assert.equal(mission.xp, mission.kind === 'boss' ? 220 : 100);
    assert.equal(mission.passScore, mission.kind === 'boss' ? 75 : 0);
    assert.equal(mission.candidate.parametersApproved, false);
  }
  assert.equal(OA_PLAN[0].prerequisiteId, PT_MISSIONS.at(-1).id);
});

test('Chefe tem itens próprios com ensino de todas as quatro aulas', () => {
  const boss = editorial.at(-1).draft;
  const exposed = new Set([...PUBLISHED_MISSIONS, ...editorial.slice(0, -1).map(e => e.draft)].flatMap(m => m.questions.map(q => q.prompt)));
  assert.equal(boss.questions.length, 12);
  assert.equal(new Set(boss.questions.map(q => q.prompt)).size, 12);
  assert(boss.questions.every(q => !exposed.has(q.prompt)));
  assert.deepEqual([...new Set(boss.questions.flatMap(q => q.originRefs.map(ref => ref.unit)))].sort(), OA_PLAN.slice(0, 4).map(p => p.unit));
});

test('rejeita pacote incompleto, duplicado ou editorial ativado', () => {
  assert.throws(() => compileOaCandidate(editorial.slice(1)), /seis unidades/);
  assert.throws(() => compileOaCandidate([...editorial.slice(1), editorial[1]]), /seis unidades/);
  const changed = structuredClone(editorial);
  changed[0].draft.publication.status = 'published';
  assert.throws(() => compileOaCandidate(changed), /origem deve permanecer draft/);
});

test('rejeita fonte ou seção de recuperação desconhecida', () => {
  const changed = structuredClone(editorial);
  changed[0].draft.sourceIds.push('fonte.inexistente');
  assert.throws(() => compileOaCandidate(changed), /fonte desconhecida/);
  const broken = structuredClone(editorial);
  broken.at(-1).draft.questions[0].originRefs[0].sectionId = 'secao-inexistente';
  assert.throws(() => compileOaCandidate(broken), /broken-teaching-reference/);
});

test('rejeita recuperação que dependa de aula futura', () => {
  const changed = structuredClone(editorial);
  changed[0].draft.questions[0].originRefs = [{ unit: 'oa04', sectionId: 'encontros' }];
  assert.throws(() => compileOaCandidate(changed), /future-prerequisite/);
});

test('OA: seis cenários de roteador real em SQLite offline, sem ativação', () => {
  const env = { ...process.env }; delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--experimental-vm-modules', '--test', '--test-reporter=tap', fileURLToPath(new URL('./helpers/studies-oa-route-runner.mjs', import.meta.url))], { env, encoding: 'utf8', timeout: 15000, maxBuffer: 1024 * 1024 });
  assert.equal(result.status, 0, result.stdout + '\n' + result.stderr);
  assert.match(result.stdout, /# pass 6\b/); assert.match(result.stdout, /# fail 0\b/);
  assert(candidate.missions.every(m => m.publication.status === 'draft' && m.candidate.parametersApproved === false));
});
