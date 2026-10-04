import vm from 'node:vm';
import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './studies-route-fixture.mjs';
import { loadOlEditorial, compileOlCandidate } from '../../scripts/studies-ol-candidate.mjs';
import { OA_MISSIONS, OA_SOURCES } from '../../studies-content/portuguese-accentuation-v1.js';
import { PT_MISSIONS, PT_SOURCES } from '../../studies-content/portuguese-text-v1.js';
import { LP_MISSIONS, LP_SOURCES } from '../../studies-content/portuguese-reading-v1.js';
import { IS_MISSIONS, IS_SOURCES } from '../../studies-content/banking-institution-specific-v1.js';
import { DP_MISSIONS, DP_SOURCES } from '../../studies-content/banking-digital-payments-v1.js';
import { PUBLISHED_MISSIONS as LIVE_MISSIONS, STUDY_SOURCES } from '../../studies-content/manifest.js';
import { publishedCatalog, publicationSnapshot } from '../../studies-content/publication-registry.js';
import { curriculumSnapshot } from '../../studies-content/curriculum-v1.js';

const dp = DP_MISSIONS.map(m => ({ ...m, publication: { ...m.publication, status: 'published' } }));
const institutional = IS_MISSIONS; // Específico CAIXA continua draft na projeção de Português comum.
const reading = LP_MISSIONS.map(m => ({ ...m, publication: { ...m.publication, status: 'published' } }));
const text = PT_MISSIONS.map(m => ({ ...m, publication: { ...m.publication, status: 'published' } }));
const accentuation = OA_MISSIONS.map(m => ({ ...m, publication: { ...m.publication, status: 'published' } }));
const PUBLISHED_MISSIONS = [...LIVE_MISSIONS, ...dp, ...reading, ...text, ...accentuation];
const candidate = compileOlCandidate(await loadOlEditorial());
// Projeção exclusiva da fixture de roteador; candidato real permanece draft e fora do manifesto.
const is = candidate.missions.map(m => ({ ...m, publication: { ...m.publication, status: 'published' } }));

let simulatedCurriculumSnapshot;
const context=vm.createContext({});
const cache=new Map();
const dpReplacement=new vm.SyntheticModule(['DP_MISSIONS','DP_SOURCES'],function(){this.setExport('DP_MISSIONS',dp);this.setExport('DP_SOURCES',DP_SOURCES);},{context});
const isReplacement=new vm.SyntheticModule(['IS_MISSIONS','IS_SOURCES'],function(){this.setExport('IS_MISSIONS',institutional);this.setExport('IS_SOURCES',IS_SOURCES);},{context});
const lpReplacement=new vm.SyntheticModule(['LP_MISSIONS','LP_SOURCES'],function(){this.setExport('LP_MISSIONS',reading);this.setExport('LP_SOURCES',LP_SOURCES);},{context});
const ptReplacement=new vm.SyntheticModule(['PT_MISSIONS','PT_SOURCES'],function(){this.setExport('PT_MISSIONS',text);this.setExport('PT_SOURCES',PT_SOURCES);},{context});
const oaReplacement=new vm.SyntheticModule(['OA_MISSIONS','OA_SOURCES'],function(){this.setExport('OA_MISSIONS',accentuation);this.setExport('OA_SOURCES',OA_SOURCES);},{context});
const replacement=new vm.SyntheticModule(['OL_MISSIONS','OL_SOURCES'],function(){this.setExport('OL_MISSIONS',is);this.setExport('OL_SOURCES',candidate.sources);},{context});
async function load(url){
 if(url.pathname.endsWith('/banking-digital-payments-v1.js'))return dpReplacement;
 if(url.pathname.endsWith('/banking-institution-specific-v1.js'))return isReplacement;
 if(url.pathname.endsWith('/portuguese-reading-v1.js'))return lpReplacement;
 if(url.pathname.endsWith('/portuguese-text-v1.js'))return ptReplacement;
 if(url.pathname.endsWith('/portuguese-accentuation-v1.js'))return oaReplacement;
 if(url.pathname.endsWith('/portuguese-spelling-letters-v1.js'))return replacement;
 if(cache.has(url.href))return cache.get(url.href);
 assert(url.pathname.includes('/studies-content/'));
 const module=new vm.SourceTextModule(fs.readFileSync(url,'utf8'),{context});cache.set(url.href,module);
 await module.link(specifier=>load(new URL(specifier,url)));return module;
}
const simulatedMap=await load(new URL('../../studies-content/curriculum-v1.js',import.meta.url));await simulatedMap.evaluate();
simulatedCurriculumSnapshot=simulatedMap.namespace.curriculumSnapshot;

test('manifesto real exclui drafts e ligação do mapa só publica OL na projeção em memória',async()=>{
 const manifest=await load(new URL('../../studies-content/manifest.js',import.meta.url));await manifest.evaluate();
 assert.equal(LIVE_MISSIONS.length,50);assert.equal(curriculumSnapshot(LIVE_MISSIONS).publishedBlocks,4);
 assert.equal(manifest.namespace.PUBLISHED_MISSIONS.length,86);
 assert.equal(manifest.namespace.validateTeachingCatalog().length,0);
 assert.equal(simulatedMap.namespace.validateCurriculum(manifest.namespace.PUBLISHED_MISSIONS).length,0);
 assert.equal(simulatedCurriculumSnapshot(manifest.namespace.PUBLISHED_MISSIONS).publishedBlocks,8);
 assert.equal(simulatedCurriculumSnapshot(manifest.namespace.PUBLISHED_MISSIONS).readiness.status,'not_measured');
 assert(candidate.missions.every(m=>m.publication.status==='draft'));
});

async function setup(t, missions) {
  const result = await fixture(t, {
    missions, sources: [...STUDY_SOURCES, ...DP_SOURCES, ...IS_SOURCES, ...LP_SOURCES, ...PT_SOURCES, ...OA_SOURCES, ...candidate.sources],
    publicationSnapshot: progress => publicationSnapshot(missions, progress), curriculumSnapshot: simulatedCurriculumSnapshot
  });
  // O perfil atualiza updated_at em toda chamada autenticada; fixe só o relógio
  // SQLite da fixture para comparar todas as colunas sem corrida entre segundos.
  const timestamp = new Date().toISOString().slice(0,19).replace('T',' ');
  result.sql.function('current_timestamp', () => timestamp);
  return result;
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
  const missions = publishedCatalog([...LIVE_MISSIONS, ...candidate.missions.map(m => ({ ...m, publication: { ...m.publication, status: 'draft' } }))]);
  const { sql, call } = await setup(t, missions);
  assert.equal((await call('bootstrap', undefined, { identity: null })).status, 401);
  assert.equal((await call('bootstrap', undefined, { identity: { username: 'outro' } })).status, 403);
  assert.equal((await call('bootstrap', undefined, { originAllowed: false })).status, 403);
  assert.equal(sql.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE type='table'").get().n, 0);
  assert.equal((await call('sessions', { missionId: is[0].id })).status, 404);
  const bootstrap = (await call('bootstrap')).body;
  assert.equal(bootstrap.missions.length, 50);
  assert.equal(bootstrap.publication.newCount, 41);
});

test('sequência OL exige SFN/MP/PC/CE/DP/LP/PT/OA concluídos, feedback ocorre só após resposta e rodada é retomada', async t => {
  const { sql, call, start } = await setup(t, [...PUBLISHED_MISSIONS, ...is]);
  assert.equal((await call('sessions', { missionId: is[0].id })).body.code, 'STUDY_PREREQUISITE_REQUIRED');
  seedCompletion(sql, PUBLISHED_MISSIONS.slice(0, -1));
  assert.equal((await call('sessions', { missionId: is[0].id })).body.code, 'STUDY_PREREQUISITE_REQUIRED');
  seedCompletion(sql, PUBLISHED_MISSIONS.slice(-1));
  assert.equal((await call('sessions', { missionId: is[1].id })).body.code, 'STUDY_PREREQUISITE_REQUIRED');
  const sessionId = await start(is[0]);
  const question = is[0].questions[0];
  const selectedOption = (question.answer + 1) % 4;
  const answer = await call('attempts', { sessionId, questionId: question.id, selectedOption });
  assert.equal(answer.status, 200);
  assert.equal(answer.body.selectedFeedback, question.optionRationales[selectedOption]);
  assert.deepEqual(answer.body.reviewRefs, is[0].teaching.questionCoverage[question.id]);
  assert.equal((await call('attempts', { sessionId, questionId: question.id, selectedOption })).body.recorded, false);
  const bootstrap = (await call('bootstrap')).body;
  assert.equal(bootstrap.resumableSession.sessionId, sessionId);
  const openedAgain = await call('sessions', { missionId: is[0].id });
  assert.equal(openedAgain.status, 409);
  assert.equal(openedAgain.body.code, 'STUDY_SESSION_RESUME_REQUIRED');
  assert.equal((await call('bootstrap')).body.resumableSession.sessionId, sessionId);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_sessions').get().n, 1);
  for (const mission of bootstrap.missions) for (const item of mission.questions) {
    assert.deepEqual(Object.keys(item).sort(), item.presentation ? ['id', 'options', 'presentation', 'prompt'] : ['id', 'options', 'prompt']);
    assert.doesNotMatch(JSON.stringify(item), /"(?:answer|explanation|optionRationales)":/);
  }
});

test('adição simulada preserva SFN/MP/PC/CE/DP/LP/PT/OA, XP, tentativas, conquista, revisões, avaliação A e sessão interrompida', async t => {
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
  const interrupted = missions.find(m => m.id === 'banking.pc.contas');
  const sessionId = await start(interrupted);
  await call('attempts', { sessionId, questionId: interrupted.questions[0].id, selectedOption: 0 });
  const prior = records(sql);
  const priorState = (await call('bootstrap')).body;
  const priorAssessment = (await call('assessments/banking.sfn-foundation')).body;
  missions.push(...is);
  const after = (await call('bootstrap')).body;
  assert.deepEqual(records(sql), prior);
  assert.deepEqual(after.progress, priorState.progress);
  assert.deepEqual(after.resumableSession, priorState.resumableSession);
  assert.deepEqual(after.reviews, priorState.reviews);
  assert.deepEqual((await call('assessments/banking.sfn-foundation')).body, priorAssessment);
  assert.deepEqual(after.publication.newMissionIds, is.map(mission => mission.id));
  assert.equal(after.publication.revisionRecommendedCount, 0);
  assert.equal(after.curriculum.readiness.status, 'not_measured');
  assert.equal(after.curriculum.publishedBlocks, 8); // Apenas projeção da fixture; catálogo ativo continua quatro blocos.
});

test('OL-R preserva recuperação nas aulas anteriores via referências do endpoint', async t => {
  const { sql, call, start } = await setup(t, [...PUBLISHED_MISSIONS, ...is]);
  await call('bootstrap');
  seedCompletion(sql, [...PUBLISHED_MISSIONS, ...is.slice(0, -2)]);
  const mission = is.at(-2);
  const sessionId = await start(mission);
  const question = mission.questions[0];
  const response = await call('attempts', { sessionId, questionId: question.id, selectedOption: (question.answer + 1) % 4 });
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.reviewRefs, mission.teaching.questionCoverage[question.id]);
  assert.ok(response.body.reviewRefs.some(ref => ref.missionId !== mission.id));
});

test('Chefe OL respeita limiar do padrão existente, XP único e não concede a conquista do SFN', async t => {
  const { sql, call, start } = await setup(t, [...PUBLISHED_MISSIONS, ...is]);
  await call('bootstrap');
  seedCompletion(sql, [...PUBLISHED_MISSIONS, ...is.slice(0, -1)]);
  const boss = is.at(-1);
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
