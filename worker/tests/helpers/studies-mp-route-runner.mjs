import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import { fixture } from './studies-route-fixture.mjs';
import { loadMpEditorial, compileMpCandidate } from '../../scripts/studies-mp-candidate.mjs';
import { PUBLISHED_MISSIONS, STUDY_SOURCES } from '../../studies-content/manifest.js';
import { publishedCatalog, publicationSnapshot } from '../../studies-content/publication-registry.js';
import { curriculumSnapshot } from '../../studies-content/curriculum-v1.js';

const candidate = compileMpCandidate(await loadMpEditorial());
// Somente nesta fixture em memória simulamos futura publicação. Não existe flag de ativação no runtime.
const mp = candidate.missions.map(mission => ({ ...mission, publication: { ...mission.publication, status: 'published' } }));

test('manifesto e mapa reais incluem o pacote apenas na simulação de status publicado', async () => {
  const context = vm.createContext({});
  const cache = new Map();
  const replacement = new vm.SyntheticModule(['MP_MISSIONS', 'MP_SOURCES'], function () {
    this.setExport('MP_MISSIONS', mp); this.setExport('MP_SOURCES', candidate.sources);
  }, { context });
  async function load(url) {
    if (url.pathname.endsWith('/banking-markets-policy-v1.js')) return replacement;
    if (cache.has(url.href)) return cache.get(url.href);
    assert.ok(url.pathname.includes('/studies-content/'));
    const module = new vm.SourceTextModule(fs.readFileSync(url, 'utf8'), { context });
    cache.set(url.href, module);
    await module.link(specifier => load(new URL(specifier, url)));
    return module;
  }
  const manifest = await load(new URL('../../studies-content/manifest.js', import.meta.url));
  await manifest.evaluate();
  const curriculum = await load(new URL('../../studies-content/curriculum-v1.js', import.meta.url));
  await curriculum.evaluate();
  const catalog = manifest.namespace;
  assert.equal(catalog.PUBLISHED_MISSIONS.length, 20);
  assert.equal(catalog.PLANNED_MISSIONS.length, 20);
  assert.equal(catalog.validateTeachingCatalog().length, 0);
  assert.equal(curriculum.namespace.validateCurriculum(catalog.PUBLISHED_MISSIONS).length, 0);
  const progress = Object.fromEntries(PUBLISHED_MISSIONS.map(mission => [mission.topicId, { coverageState: 3 }]));
  const state = curriculum.namespace.curriculumSnapshot(catalog.PUBLISHED_MISSIONS, progress);
  assert.equal(state.publishedBlocks, 2);
  assert.equal(state.completedBlocks, 1);
  assert.equal(state.readiness.status, 'not_measured');
  assert.equal(catalog.publicationSnapshot(progress).newCount, 11);
});
async function setup(t, missions) {
  return fixture(t, {
    missions, sources: [...STUDY_SOURCES, ...candidate.sources],
    publicationSnapshot: progress => publicationSnapshot(missions, progress), curriculumSnapshot
  });
}
function seedCompletion(sql, missions) {
  const insert = sql.prepare(`INSERT OR IGNORE INTO study_topic_progress
    (username,topic_id,coverage_state,mastery_score,content_version_seen) VALUES ('wellyton',?,3,0,?)`);
  for (const mission of missions) insert.run(mission.topicId, mission.contentVersion);
}
function records(sql) {
  return Object.fromEntries(sql.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'study_%' ORDER BY name").all()
    .map(({ name }) => [name, sql.prepare(`SELECT * FROM ${name} ORDER BY rowid`).all()]));
}
async function finish(call, start, mission, choices = mission.questions.map(question => question.answer)) {
  const sessionId = await start(mission);
  for (const [index, question] of mission.questions.entries()) {
    assert.equal((await call('attempts', { sessionId, questionId: question.id, selectedOption: choices[index] })).status, 200);
  }
  const completion = await call(`missions/${mission.id}/complete`, { sessionId });
  return { sessionId, completion };
}

test('draft inacessível e autorização exclusiva antes de inicializar persistência', async t => {
  const missions = publishedCatalog([...PUBLISHED_MISSIONS, ...candidate.missions]);
  const { sql, call } = await setup(t, missions);
  assert.equal((await call('bootstrap', undefined, { identity: null })).status, 401);
  assert.equal((await call('bootstrap', undefined, { identity: { username: 'outro' } })).status, 403);
  assert.equal((await call('bootstrap', undefined, { originAllowed: false })).status, 403);
  assert.equal(sql.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE type='table'").get().n, 0);
  assert.equal((await call('sessions', { missionId: mp[0].id })).status, 404);
  const bootstrap = (await call('bootstrap')).body;
  assert.equal(bootstrap.missions.length, 9);
  assert.equal(bootstrap.publication.newCount, 0);
});

test('sequência MP exige SFN concluído, feedback ocorre só após resposta e rodada é retomada', async t => {
  const { sql, call, start } = await setup(t, [...PUBLISHED_MISSIONS, ...mp]);
  assert.equal((await call('sessions', { missionId: mp[0].id })).body.code, 'STUDY_PREREQUISITE_REQUIRED');
  seedCompletion(sql, PUBLISHED_MISSIONS);
  assert.equal((await call('sessions', { missionId: mp[1].id })).body.code, 'STUDY_PREREQUISITE_REQUIRED');
  const sessionId = await start(mp[0]);
  const question = mp[0].questions[0];
  const selectedOption = (question.answer + 1) % 4;
  const answer = await call('attempts', { sessionId, questionId: question.id, selectedOption });
  assert.equal(answer.status, 200);
  assert.equal(answer.body.selectedFeedback, question.optionRationales[selectedOption]);
  assert.deepEqual(answer.body.reviewRefs, mp[0].teaching.questionCoverage[question.id]);
  assert.equal((await call('attempts', { sessionId, questionId: question.id, selectedOption })).body.recorded, false);
  const bootstrap = (await call('bootstrap')).body;
  assert.equal(bootstrap.resumableSession.sessionId, sessionId);
  const openedAgain = await call('sessions', { missionId: mp[0].id });
  assert.equal(openedAgain.status, 409);
  assert.equal(openedAgain.body.code, 'STUDY_SESSION_RESUME_REQUIRED');
  assert.equal((await call('bootstrap')).body.resumableSession.sessionId, sessionId);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_sessions').get().n, 1);
  for (const mission of bootstrap.missions) for (const item of mission.questions) {
    assert.deepEqual(Object.keys(item).sort(), item.presentation ? ['id', 'options', 'presentation', 'prompt'] : ['id', 'options', 'prompt']);
    assert.doesNotMatch(JSON.stringify(item), /"(?:answer|explanation|optionRationales)":/);
  }
});

test('adição simulada preserva SFN, XP, tentativas, conquista, revisões, avaliação A e sessão interrompida', async t => {
  const missions = [...PUBLISHED_MISSIONS];
  const { sql, call, start } = await setup(t, missions);
  const first = await finish(call, start, missions[0]);
  assert.equal(first.completion.body.xpGranted, 100);
  await call(`sessions/${first.sessionId}`, { durationSeconds: 0 }, { method: 'PATCH' });
  seedCompletion(sql, PUBLISHED_MISSIONS);
  const assessment = await call('assessments/banking.sfn-foundation/start', {});
  assert.equal(assessment.status, 201);
  for (const question of assessment.body.questions) {
    assert.equal((await call(`assessments/${assessment.body.assessmentId}/answers`, { questionId: question.id, selectedOption: 0 })).status, 200);
  }
  assert.equal((await call(`assessments/${assessment.body.assessmentId}/complete`, {})).status, 200);
  const sessionId = await start(missions[0]);
  await call('attempts', { sessionId, questionId: missions[0].questions[0].id, selectedOption: 0 });
  const prior = records(sql);
  const priorState = (await call('bootstrap')).body;
  const priorAssessment = (await call('assessments/banking.sfn-foundation')).body;
  missions.push(...mp);
  const after = (await call('bootstrap')).body;
  assert.deepEqual(records(sql), prior);
  assert.deepEqual(after.progress, priorState.progress);
  assert.deepEqual(after.resumableSession, priorState.resumableSession);
  assert.deepEqual(after.reviews, priorState.reviews);
  assert.deepEqual((await call('assessments/banking.sfn-foundation')).body, priorAssessment);
  assert.deepEqual(after.publication.newMissionIds, mp.map(mission => mission.id));
  assert.equal(after.publication.revisionRecommendedCount, 0);
  assert.equal(after.curriculum.readiness.status, 'not_measured');
  assert.equal(after.curriculum.publishedBlocks, 1); // mapa ativo ainda não declara cobertura MP.
});

test('MP-R preserva recuperação nas aulas anteriores via referências do endpoint', async t => {
  const { sql, call, start } = await setup(t, [...PUBLISHED_MISSIONS, ...mp]);
  await call('bootstrap');
  seedCompletion(sql, [...PUBLISHED_MISSIONS, ...mp.slice(0, 9)]);
  const mission = mp[9];
  const sessionId = await start(mission);
  const question = mission.questions[0];
  const response = await call('attempts', { sessionId, questionId: question.id, selectedOption: (question.answer + 1) % 4 });
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.reviewRefs, mission.teaching.questionCoverage[question.id]);
  assert.ok(response.body.reviewRefs.some(ref => ref.missionId !== mission.id));
});

test('Chefe MP respeita limiar proposto, XP único e não concede a conquista do SFN', async t => {
  const { sql, call, start } = await setup(t, [...PUBLISHED_MISSIONS, ...mp]);
  await call('bootstrap');
  seedCompletion(sql, [...PUBLISHED_MISSIONS, ...mp.slice(0, -1)]);
  const boss = mp.at(-1);
  const choices = hits => boss.questions.map((q, index) => index < hits ? q.answer : (q.answer + 1) % 4);
  const failed = await finish(call, start, boss, choices(8));
  assert.equal(failed.completion.status, 422);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_xp_events').get().n, 0);
  const passed = await finish(call, start, boss, choices(9));
  assert.equal(passed.completion.status, 200);
  assert.equal(passed.completion.body.score, 75);
  assert.equal(passed.completion.body.xpGranted, 220);
  assert.equal((await call(`missions/${boss.id}/complete`, { sessionId: passed.sessionId })).body.xpGranted, 0);
  assert.equal(sql.prepare("SELECT COUNT(*) n FROM study_achievements WHERE achievement_id='study.sfn.boss'").get().n, 0);
});
