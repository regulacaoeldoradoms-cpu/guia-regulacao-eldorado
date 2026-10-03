import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { DP_PLAN, loadDpEditorial, compileDpCandidate } from '../scripts/studies-dp-candidate.mjs';
import { PUBLISHED_MISSIONS, STUDY_SOURCES, missionById, validateTeachingCatalog } from '../studies-content/manifest.js';
import { publishedCatalog } from '../studies-content/publication-registry.js';
import { DP_MISSIONS, DP_SOURCES } from '../studies-content/banking-digital-payments-v1.js';

const editorial = await loadDpEditorial();
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const baselineHash = hash({ missions: PUBLISHED_MISSIONS, sources: STUDY_SOURCES });
const candidate = compileDpCandidate(editorial);

test('DP desativado não expõe missões nem altera catálogo e fontes existentes', () => {
  assert.equal(candidate.status, 'draft');
  assert.equal(candidate.missions.length, 14);
  assert(candidate.missions.every(m => m.publication.status === 'draft' && m.candidate.parametersApproved === false));
  assert.deepEqual(publishedCatalog([...PUBLISHED_MISSIONS, ...candidate.missions]), PUBLISHED_MISSIONS);
  for (const m of candidate.missions) assert.equal(missionById(m.id), null);
  assert.equal(hash({ missions: PUBLISHED_MISSIONS, sources: STUDY_SOURCES }), baselineHash);
});

test('pacote gerado preserva o texto editorial e projeta IDs e recuperação válidos', () => {
  assert.deepEqual(DP_MISSIONS, candidate.missions);
  assert.deepEqual(DP_SOURCES, candidate.sources);
  assert.deepEqual(validateTeachingCatalog([...PUBLISHED_MISSIONS, ...candidate.missions], [...STUDY_SOURCES, ...candidate.sources]), []);
  for (let i = 0; i < editorial.length; i++) {
    const draft = editorial[i].draft, compiled = candidate.missions[i];
    for (let j = 0; j < draft.sections.length; j++) assert.equal(compiled.sections[j].body, draft.sections[j].body);
    for (let j = 0; j < draft.questions.length; j++) {
      const original = draft.questions[j], question = compiled.questions[j];
      assert.equal(question.prompt, original.prompt);
      assert.deepEqual(question.options, original.options);
      assert.equal(question.answer, original.answer);
      assert.equal(question.explanation, original.explanation);
      assert.deepEqual(question.optionRationales, original.optionRationales);
      for (const origin of original.originRefs || []) {
        const missionId = DP_PLAN.find(p => p.unit === origin.unit).id;
        assert(compiled.teaching.questionCoverage[question.id].some(ref => ref.missionId === missionId && ref.sectionId === origin.sectionId));
      }
    }
  }
});

test('sequência proposta depende de CE e não altera XP ou pré-requisitos publicados', () => {
  assert.equal(PUBLISHED_MISSIONS.at(-1).id, 'banking.ce.boss');
  assert.equal(PUBLISHED_MISSIONS.at(-1).order, 50);
  for (const [i, mission] of candidate.missions.entries()) {
    assert.equal(mission.order, i + 51);
    assert.equal(mission.candidate.prerequisiteId, i ? candidate.missions[i - 1].id : 'banking.ce.boss');
    assert.equal(mission.xp, mission.kind === 'boss' ? 220 : 100);
    assert.equal(mission.passScore, mission.kind === 'boss' ? 75 : 0);
  }
  assert.equal(hash({ missions: PUBLISHED_MISSIONS, sources: STUDY_SOURCES }), baselineHash);
});

test('Chefe tem doze enunciados próprios e origens em todas as doze aulas', () => {
  const boss = editorial.at(-1).draft;
  const exposed = new Set([...PUBLISHED_MISSIONS, ...editorial.slice(0, -1).map(e => e.draft)].flatMap(m => m.questions.map(q => q.prompt)));
  assert.equal(boss.questions.length, 12);
  assert.equal(new Set(boss.questions.map(q => q.prompt)).size, 12);
  assert(boss.questions.every(q => !exposed.has(q.prompt)));
  assert.deepEqual([...new Set(boss.questions.flatMap(q => q.originRefs.map(ref => ref.unit)))].sort(), DP_PLAN.slice(0, 12).map(p => p.unit));
});

test('preparação rejeita pacote incompleto, duplicado ou editorial já ativado', () => {
  assert.throws(() => compileDpCandidate(editorial.slice(1)), /quatorze unidades/);
  assert.throws(() => compileDpCandidate([...editorial.slice(1), editorial[1]]), /quatorze unidades/);
  const changed = structuredClone(editorial);
  changed[0].draft.publication.status = 'published';
  assert.throws(() => compileDpCandidate(changed), /origem deve permanecer draft/);
});

test('preparação rejeita fonte ou recuperação desconhecida', () => {
  const changed = structuredClone(editorial);
  changed[0].draft.sourceIds.push('fonte.inexistente');
  assert.throws(() => compileDpCandidate(changed), /fonte desconhecida/);
  const broken = structuredClone(editorial);
  broken.at(-1).draft.questions[0].originRefs[0].sectionId = 'secao-inexistente';
  assert.throws(() => compileDpCandidate(broken), /broken-teaching-reference/);
});

test('recuperação rejeita referência a aula futura', () => {
  const changed = structuredClone(editorial);
  const question = changed[0].draft.questions[0];
  question.originRefs = [{ unit: 'dp12', sectionId: 'indicadores' }];
  assert.throws(() => compileDpCandidate(changed), /future-prerequisite/);
});

test('DP: seis cenários do roteador real em SQLite offline, sem ativação', () => {
  const env = {...process.env}; delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--experimental-vm-modules', '--test', '--test-reporter=tap', fileURLToPath(new URL('./helpers/studies-dp-route-runner.mjs', import.meta.url))], {env, encoding:'utf8', timeout:15000, maxBuffer:1024*1024});
  assert.equal(result.status,0,result.stdout+'\n'+result.stderr);
  assert.match(result.stdout,/# pass 6\b/); assert.match(result.stdout,/# fail 0\b/);
  assert(candidate.missions.every(m => m.publication.status === 'draft' && m.candidate.parametersApproved === false));
});
