import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadPcEditorial, compilePcCandidate, PC_PLAN } from '../scripts/studies-pc-candidate.mjs';
import { PUBLISHED_MISSIONS, PLANNED_MISSIONS, STUDY_SOURCES } from '../studies-content/manifest.js';
import { publishedCatalog, publicationSnapshot } from '../studies-content/publication-registry.js';
import { curriculumSnapshot, EXAM_PROFILES } from '../studies-content/curriculum-v1.js';
import { questionFeedbackById } from '../studies-content/question-feedback-v1.js';

const editorial = await loadPcEditorial();
const baseline = PUBLISHED_MISSIONS.filter(m => !m.id.startsWith('banking.pc.'));
const before = structuredClone(editorial);
const candidate = compilePcCandidate(editorial);

test('conversão PC preserva conteúdo aprovado e mapeia IDs, fontes e recuperação sem mutar originais', () => {
  assert.deepEqual(editorial, before);
  assert.equal(candidate.missions.length, 17);
  assert.equal(candidate.feedback.length, 144);
  assert.equal(candidate.feedback.reduce((sum, item) => sum + item.optionReasons.length, 0), 576);
  for (const [index, mission] of candidate.missions.entries()) {
    const { draft, sources } = editorial[index];
    assert.equal(mission.id, PC_PLAN[index].id);
    assert.equal(mission.topicId, mission.id);
    assert.equal(mission.order, index + 21);
    assert.equal(mission.xp, mission.kind === 'boss' ? 220 : 100);
    assert.equal(mission.passScore, mission.kind === 'boss' ? 75 : 0);
    assert.equal(mission.candidate.prerequisiteId, index ? candidate.missions[index - 1].id : 'banking.mp.boss');
    assert.equal(mission.candidate.parametersApproved, true);
    assert.deepEqual(mission.sections.map(s => [s.id, s.type, s.heading, s.body]), draft.sections.map(s => [s.id, s.type, s.heading, s.body.replace('Elas e esta revisão ainda são rascunhos, disponíveis aqui para revisão editorial, fora do aplicativo. ', '').replace('Os materiais PC permanecem rascunhos, acessíveis nestes documentos e fora do catálogo. ', '').replace('mas ficam expostos nesta prévia;', 'mas ficam expostos nesta prática;').replace(' Nenhuma regra de XP, limiar, publicação, desbloqueio ou revisão adaptativa foi criada neste rascunho.', '')]));
    assert.deepEqual(mission.recall, draft.recall);
    for (const [qi, question] of mission.questions.entries()) {
      const original = draft.questions[qi];
      assert.equal(question.id, `q.${original.id}`);
      for (const field of ['prompt', 'options', 'answer', 'explanation', 'optionRationales']) {
        assert.deepEqual(question[field], original[field]);
      }
      for (const ref of original.originRefs || []) {
        const origin = PC_PLAN.find(plan => plan.unit === ref.unit);
        assert.ok(mission.teaching.questionCoverage[question.id].some(item => item.missionId === origin.id && item.sectionId === ref.sectionId));
      }
      assert.deepEqual(questionFeedbackById(question.id, question).optionReasons, original.optionRationales);
    }
    for (const source of sources) {
      const converted = candidate.sources.find(item => item.id === `pc.${PC_PLAN[index].unit}.${source.id}`);
      assert.deepEqual({ ...converted, id: source.id }, source);
    }
  }
});

test('PC aprovado entra no catálogo; draft equivalente e publicação inválida continuam recusados', () => {
  assert.ok(candidate.missions.every(m => m.publication.status === 'published' && m.publication.releaseSequence === 3 && m.publication.changeImpact === 'new'));
  const drafts = candidate.missions.map(m => ({...m, publication:{...m.publication,status:'draft'}}));
  assert.deepEqual(publishedCatalog([...baseline, ...drafts]), baseline);
  assert.deepEqual(publishedCatalog([...baseline, ...candidate.missions]), PUBLISHED_MISSIONS);
  assert.equal(publicationSnapshot([...baseline, ...drafts]).newCount, publicationSnapshot(baseline).newCount);
  assert.equal(PUBLISHED_MISSIONS.length, 37);
  assert.equal(PUBLISHED_MISSIONS.flatMap(m => m.questions).length, 266);
  assert.equal(PLANNED_MISSIONS.length, 37);
  assert.ok(candidate.sources.every(s => STUDY_SOURCES.some(active => active.id === s.id)));
  const map = curriculumSnapshot(PUBLISHED_MISSIONS);
  assert.equal(map.publishedBlocks, 3);
  assert.equal(map.totalBlocks, 43);
  assert.equal(map.readiness.status, 'not_measured');
  assert.ok(EXAM_PROFILES.every(profile => profile.referenceOnly));
  const invalid = structuredClone(candidate.missions);
  invalid[0].publication.status = 'typo';
  assert.throws(() => publishedCatalog([...baseline, ...invalid]), /publication/i);
});

test('conversão enumera apresentação sem apagar gráficos, tabelas ou referências', () => {
  const requirements = candidate.readingRequirements;
  assert.equal(requirements.filter(item => item.formats.includes('diagram')).length, 0);
  assert.equal(requirements.filter(item => item.formats.includes('table')).length, 3);
  assert.ok(requirements.some(item => item.formats.includes('lesson-link')));
});

test('pacote incompleto, origem publicada, fonte desconhecida e cobrança futura são rejeitados', () => {
  assert.throws(() => compilePcCandidate(editorial.slice(1)), /dezessete unidades/);
  const published = structuredClone(editorial);
  published[0].draft.publication.status = 'published';
  assert.throws(() => compilePcCandidate(published), /origem deve permanecer draft/);
  const unknown = structuredClone(editorial);
  unknown[0].draft.sourceIds.push('nao-existe');
  assert.throws(() => compilePcCandidate(unknown), /fonte desconhecida/);
  const future = structuredClone(editorial);
  future[0].draft.teaching.questionCoverage[future[0].draft.questions[0].id].push({
    missionId: 'draft.pc11a', sectionId: 'inicio'
  });
  assert.throws(() => compilePcCandidate(future), /future-prerequisite/);
  const duplicate = structuredClone(editorial);
  duplicate[0].draft.questions.push(duplicate[0].draft.questions[0]);
  assert.throws(() => compilePcCandidate(duplicate), /duplicate-question-id/);
  const unknownLink = structuredClone(editorial);
  unknownLink[0].draft.sections[0].body += '\n\n[Aula futura](pc-11a-v1.md)';
  assert.throws(() => compilePcCandidate(unknownLink), /Link de aula não resolvido/);
});

test('artefato gerado reproduz o candidato, três tabelas e links anteriores resolvem no leitor', async () => {
  const { PC_MISSIONS, PC_SOURCES } = await import('../studies-content/banking-products-credit-v1.js');
  assert.deepEqual(PC_MISSIONS, candidate.missions);
  assert.deepEqual(PC_SOURCES, candidate.sources);
  const all = new Map(candidate.missions.map(m => [m.id, m]));
  let links = 0;
  for (const m of candidate.missions) for (const item of [...m.sections, ...m.questions]) {
    for (const block of item.presentation || []) {
      if (block.type === 'table') {
        assert.ok(block.headers.length > 1 && block.rows.length > 0);
        assert.ok(block.rows.every(row => row.length === block.headers.length));
      }
      for (const run of block.runs || []) if (run.missionId) {
        links++;
        const target = all.get(run.missionId);
        assert.ok(target && target.order <= m.order);
        assert.ok(target.sections.some(section => section.id === run.sectionId));
      }
    }
  }
  assert.ok(links > 20);
  assert.ok(!JSON.stringify(candidate).includes('draft.pc07'));
  assert.ok(candidate.missions.every(m => !m.id.includes('habitacional')));
  const boss = candidate.missions.at(-1);
  assert.match(boss.questions[8].prompt, /conta de poupança aberta em 2011/);
  assert.equal(boss.questions[8].answer, 2);
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

test('candidato PC: seis cenários de catálogo e roteador reais, autorização e preservação', () => {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--experimental-vm-modules', '--test', '--test-reporter=tap',
    fileURLToPath(new URL('./helpers/studies-pc-route-runner.mjs', import.meta.url))], {
    env, encoding: 'utf8', timeout: 15000, maxBuffer: 1024 * 1024
  });
  assert.equal(result.status, 0, result.stdout + '\n' + result.stderr);
  assert.match(result.stdout, /# pass 6\b/);
  assert.match(result.stdout, /# fail 0\b/);
});
