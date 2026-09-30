import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadMpEditorial, compileMpCandidate, MP_PLAN } from '../scripts/studies-mp-candidate.mjs';
import { PUBLISHED_MISSIONS, PLANNED_MISSIONS, STUDY_SOURCES } from '../studies-content/manifest.js';
import { publishedCatalog, publicationSnapshot } from '../studies-content/publication-registry.js';
import { curriculumSnapshot } from '../studies-content/curriculum-v1.js';
import { questionFeedbackById } from '../studies-content/question-feedback-v1.js';

const editorial = await loadMpEditorial();
const before = structuredClone(editorial);
const candidate = compileMpCandidate(editorial);

test('conversão MP preserva conteúdo aprovado e mapeia IDs, fontes e recuperação sem mutar originais', () => {
  assert.deepEqual(editorial, before);
  assert.equal(candidate.missions.length, 11);
  assert.equal(candidate.feedback.length, 84);
  assert.equal(candidate.feedback.reduce((sum, item) => sum + item.optionReasons.length, 0), 336);
  for (const [index, mission] of candidate.missions.entries()) {
    const { draft, sources } = editorial[index];
    assert.equal(mission.id, MP_PLAN[index].id);
    assert.equal(mission.topicId, mission.id);
    assert.equal(mission.order, index + 10);
    assert.equal(mission.candidate.prerequisiteId, index ? candidate.missions[index - 1].id : 'banking.sfn.boss');
    assert.equal(mission.candidate.parametersApproved, false);
    assert.deepEqual(mission.sections.map(s => [s.id, s.type, s.heading, s.body]), draft.sections.map(s => [s.id, s.type, s.heading, s.body]));
    assert.deepEqual(mission.recall, draft.recall);
    for (const [qi, question] of mission.questions.entries()) {
      const original = draft.questions[qi];
      assert.equal(question.id, `q.${original.id}`);
      for (const field of ['prompt', 'options', 'answer', 'explanation', 'optionRationales']) {
        assert.deepEqual(question[field], original[field]);
      }
      for (const ref of original.originRefs || []) {
        const origin = MP_PLAN.find(plan => plan.unit === ref.unit);
        assert.ok(mission.teaching.questionCoverage[question.id].some(item => item.missionId === origin.id && item.sectionId === ref.sectionId));
      }
      assert.deepEqual(questionFeedbackById(question.id, question).optionReasons, original.optionRationales);
    }
    for (const source of sources) {
      const converted = candidate.sources.find(item => item.id === `mp.${MP_PLAN[index].unit}.${source.id}`);
      assert.deepEqual({ ...converted, id: source.id }, source);
    }
  }
});

test('candidato fica excluído: publicação, fontes, plano e mapa ativos continuam SFN', () => {
  assert.ok(candidate.missions.every(mission => mission.publication.status === 'draft'));
  assert.deepEqual(publishedCatalog([...PUBLISHED_MISSIONS, ...candidate.missions]), PUBLISHED_MISSIONS);
  assert.deepEqual(publicationSnapshot([...PUBLISHED_MISSIONS, ...candidate.missions]), publicationSnapshot(PUBLISHED_MISSIONS));
  assert.equal(PUBLISHED_MISSIONS.length, 9);
  assert.equal(PLANNED_MISSIONS.length, 9);
  assert.ok(STUDY_SOURCES.every(source => !source.id.startsWith('mp.')));
  const map = curriculumSnapshot(PUBLISHED_MISSIONS);
  assert.equal(map.publishedBlocks, 1);
  assert.equal(map.totalBlocks, 43);
  assert.equal(map.readiness.status, 'not_measured');
});

test('conversão enumera apresentação pendente sem apagar gráficos, tabelas ou referências', () => {
  const requirements = candidate.readingRequirements;
  assert.equal(requirements.filter(item => item.formats.includes('diagram')).length, 5);
  assert.equal(requirements.filter(item => item.formats.includes('table')).length, 3);
  assert.ok(requirements.some(item => item.location === 'question:q.mpchefe.q11'));
  assert.ok(requirements.some(item => item.formats.includes('lesson-link')));
});

test('pacote incompleto, origem publicada, fonte desconhecida e cobrança futura são rejeitados', () => {
  assert.throws(() => compileMpCandidate(editorial.slice(1)), /onze unidades/);
  const published = structuredClone(editorial);
  published[0].draft.publication.status = 'published';
  assert.throws(() => compileMpCandidate(published), /origem deve permanecer draft/);
  const unknown = structuredClone(editorial);
  unknown[0].draft.sourceIds.push('nao-existe');
  assert.throws(() => compileMpCandidate(unknown), /fonte desconhecida/);
  const future = structuredClone(editorial);
  future[0].draft.teaching.questionCoverage[future[0].draft.questions[0].id].push({
    missionId: 'draft.mp09', sectionId: 'eixos'
  });
  assert.throws(() => compileMpCandidate(future), /future-prerequisite/);
});

test('feedback mantém prioridade SFN e rejeita dados incompletos ou de outra questão', () => {
  const original = questionFeedbackById('q.sfn.01');
  assert.equal(questionFeedbackById('q.sfn.01', { id: 'q.sfn.01', options: ['A'], optionRationales: ['Troca'] }), original);
  const question = candidate.missions[0].questions[0];
  assert.equal(questionFeedbackById('outro', question), null);
  assert.equal(questionFeedbackById(question.id, { ...question, optionRationales: ['Incompleto'] }), null);
  assert.equal(questionFeedbackById(question.id, { ...question, optionRationales: ['', 'B', 'C', 'D'] }), null);
  assert.equal(questionFeedbackById(question.id), null);
});

test('roteador real com candidato MP: cinco cenários locais de autorização/preservação/rodadas', () => {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--experimental-vm-modules', '--test', '--test-reporter=tap',
    fileURLToPath(new URL('./helpers/studies-mp-route-runner.mjs', import.meta.url))], {
    env, encoding: 'utf8', timeout: 15000, maxBuffer: 1024 * 1024
  });
  assert.equal(result.status, 0, result.stdout + '\n' + result.stderr);
  assert.match(result.stdout, /# pass 5\b/);
  assert.match(result.stdout, /# fail 0\b/);
});
