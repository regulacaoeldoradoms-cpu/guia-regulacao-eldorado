import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { sqliteD1 } from './helpers/studies-sqlite.mjs';
import { randomUUID } from 'node:crypto';
import {
  StudyRoundError, ensureRoundSchema, startStudyRound, getStudyRound,
  recordRoundAttempt, evaluateStudyRound, commitReviewReward, finishStudySession
} from '../study-rounds.js';

// Executa SQL real em SQLite. A interface externa simula o binding D1;
// o batch usa transação real, não respostas hard-coded nem banco produtivo.

async function setup(t) {
  const sql = new DatabaseSync(':memory:');
  t.after(() => sql.close());
  sql.exec(`PRAGMA foreign_keys=ON;
    CREATE TABLE study_sessions(session_id TEXT PRIMARY KEY, username TEXT NOT NULL, mission_id TEXT,
      started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, finished_at TEXT, duration_seconds INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'active');
    CREATE TABLE study_attempts(attempt_id TEXT PRIMARY KEY, username TEXT NOT NULL, question_id TEXT NOT NULL,
      topic_id TEXT NOT NULL, content_version INTEGER NOT NULL, selected_option INTEGER NOT NULL,
      correct INTEGER NOT NULL, attempted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE study_reviews(review_id TEXT PRIMARY KEY, username TEXT NOT NULL, topic_id TEXT NOT NULL,
      cycle INTEGER NOT NULL, due_at TEXT NOT NULL, completed_at TEXT, status TEXT NOT NULL DEFAULT 'pending', UNIQUE(username,topic_id,cycle));
    CREATE TABLE study_xp_events(event_id TEXT PRIMARY KEY, username TEXT NOT NULL, event_type TEXT NOT NULL,
      ref_id TEXT NOT NULL, points INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(username,event_type,ref_id));`);
  const db = sqliteD1(sql);
  await ensureRoundSchema(db);
  return { sql, db };
}
function mission(id = 'fixture.boss', kind = 'boss', size = 4) {
  return { id, topicId: id, kind, contentVersion: 2, passScore: 75, questions: Array.from({ length: size }, (_, i) => ({ id: `${id}.q${i}`, options: ['A','B'], answer: 0 })) };
}
const user = 'wellyton';
const reject = (fn, status = 409) => assert.rejects(fn, (error) => error instanceof StudyRoundError && error.status === status);
const read = (sql, query, ...params) => sql.prepare(query).get(...params);
const count = (sql, table) => read(sql, `SELECT COUNT(*) AS n FROM ${table}`).n;
async function fill(db, m, sessionId, choices = []) {
  for (let i = 0; i < m.questions.length; i++) await recordRoundAttempt(db, user, m, m.questions[i], choices[i] ?? 0, sessionId);
}
function addReview(sql, m, cycle = 1, due = '-1 day', owner = user) {
  const id = randomUUID();
  sql.prepare(`INSERT INTO study_reviews(review_id, username, topic_id, cycle, due_at) VALUES (?, ?, ?, ?, datetime('now',?))`)
    .run(id, owner, m.topicId, cycle, due);
  return id;
}
function historical(sql, m, correct = 1) {
  for (const q of m.questions) sql.prepare(`INSERT INTO study_attempts(attempt_id, username, question_id, topic_id, content_version, selected_option, correct)
    VALUES (?, ?, ?, ?, 1, ?, ?)`).run(randomUUID(), user, q.id, m.topicId, correct ? 0 : 1, correct);
}

test('schema adicional é idempotente e preserva tentativas históricas', async (t) => {
  const { sql, db } = await setup(t); const m = mission(); historical(sql, m);
  await ensureRoundSchema(db);
  assert.equal(count(sql, 'study_attempts'), 4);
  assert.equal(count(sql, 'study_round_answers'), 0);
});

test('abertura registra sessão e rodada no mesmo batch', async (t) => {
  const { sql, db } = await setup(t); const m = mission();
  const r = await startStudyRound(db, user, m);
  assert.equal(r.mode, 'boss'); assert.equal(r.roundProtocol, 1);
  assert.equal(count(sql, 'study_sessions'), 1); assert.equal(count(sql, 'study_rounds'), 1);
  assert.equal((await getStudyRound(db, user, m, r.sessionId)).questionIds.length, 4);
});

test('falha ao criar rodada desfaz também a sessão', async (t) => {
  const { sql, db } = await setup(t);
  sql.exec("CREATE TRIGGER fixture_fail BEFORE INSERT ON study_rounds BEGIN SELECT RAISE(ABORT,'fixture'); END");
  await assert.rejects(() => startStudyRound(db, user, mission()), /fixture/);
  assert.equal(count(sql, 'study_sessions'), 0);
});

test('respostas antigas e duas sessões com o mesmo segundo não completam rodada nova', async (t) => {
  const { sql, db } = await setup(t); const m = mission(); historical(sql, m);
  const a = await startStudyRound(db, user, m); const b = await startStudyRound(db, user, m);
  sql.exec("UPDATE study_sessions SET started_at='2026-09-26 12:00:00'");
  await fill(db, m, a.sessionId);
  await reject(() => evaluateStudyRound(db, user, m, b.sessionId, 'boss'));
  assert.equal((await evaluateStudyRound(db, user, m, a.sessionId, 'boss')).score, 100);
  assert.equal(count(sql, 'study_attempts'), 8);
});

test('não usa respostas parciais de outra aba para completar a atual', async (t) => {
  const { db } = await setup(t); const m = mission();
  const a = await startStudyRound(db, user, m); const b = await startStudyRound(db, user, m);
  for (let i = 0; i < 4; i++) await recordRoundAttempt(db, user, m, m.questions[i], 0, i < 2 ? a.sessionId : b.sessionId);
  await reject(() => evaluateStudyRound(db, user, m, a.sessionId, 'boss'));
  await reject(() => evaluateStudyRound(db, user, m, b.sessionId, 'boss'));
});

test('a identidade da conta e da missão participa da validação', async (t) => {
  const { db } = await setup(t); const m = mission(); const r = await startStudyRound(db, user, m);
  await reject(() => getStudyRound(db, 'outro', m, r.sessionId), 404);
  await reject(() => recordRoundAttempt(db, 'outro', m, m.questions[0], 0, r.sessionId), 404);
  await reject(() => getStudyRound(db, user, mission('outra'), r.sessionId), 404);
});

test('cliente sem sessionId não é associado silenciosamente à sessão mais recente', async (t) => {
  const { sql, db } = await setup(t); const m = mission(); await startStudyRound(db, user, m);
  await reject(() => recordRoundAttempt(db, user, m, m.questions[0], 0, undefined));
  assert.equal(count(sql, 'study_attempts'), 0);
});

test('tipos inválidos de alternativa não viram a opção zero', async (t) => {
  const { sql, db } = await setup(t); const m = mission(); const r = await startStudyRound(db, user, m);
  for (const value of [null, false, '', '0', -1, 0.5, 2, NaN]) await reject(() => recordRoundAttempt(db, user, m, m.questions[0], value, r.sessionId), 400);
  assert.equal(count(sql, 'study_attempts'), 0);
});

test('repetir a mesma resposta não duplica tentativas ou distorce estatísticas', async (t) => {
  const { sql, db } = await setup(t); const m = mission(); const r = await startStudyRound(db, user, m);
  assert.equal((await recordRoundAttempt(db, user, m, m.questions[0], 0, r.sessionId)).recorded, true);
  assert.equal((await recordRoundAttempt(db, user, m, m.questions[0], 0, r.sessionId)).recorded, false);
  assert.equal(count(sql, 'study_attempts'), 1); assert.equal(count(sql, 'study_round_answers'), 1);
});

test('duas requisições concorrentes idênticas produzem apenas um registro', async (t) => {
  const { sql, db } = await setup(t); const m = mission(); const r = await startStudyRound(db, user, m);
  const results = await Promise.all([recordRoundAttempt(db,user,m,m.questions[0],0,r.sessionId), recordRoundAttempt(db,user,m,m.questions[0],0,r.sessionId)]);
  assert.equal(results.filter((a) => a.recorded).length, 1);
  assert.equal(count(sql, 'study_attempts'), 1);
});

test('não substitui resposta após revelar o comentário da questão', async (t) => {
  const { sql, db } = await setup(t); const m = mission(); const r = await startStudyRound(db, user, m);
  await recordRoundAttempt(db, user, m, m.questions[0], 1, r.sessionId);
  await reject(() => recordRoundAttempt(db, user, m, m.questions[0], 0, r.sessionId));
  assert.equal(read(sql, 'SELECT correct FROM study_attempts').correct, 0);
  assert.equal(count(sql, 'study_attempts'), 1);
});

test('erro no vínculo transacional não deixa uma tentativa órfã', async (t) => {
  const { sql, db } = await setup(t); const m = mission(); const r = await startStudyRound(db, user, m);
  sql.exec("CREATE TRIGGER fixture_link_fail BEFORE INSERT ON study_round_answers BEGIN SELECT RAISE(ABORT,'link'); END");
  await assert.rejects(() => recordRoundAttempt(db, user, m, m.questions[0], 0, r.sessionId), /link/);
  assert.equal(count(sql, 'study_attempts'), 0);
});

test('Chefe exige 75%, congela resultado e permite nova tentativa em outra rodada', async (t) => {
  const { db } = await setup(t); const m = mission();
  const failed = await startStudyRound(db, user, m); await fill(db,m,failed.sessionId,[0,0,1,1]);
  const result = await evaluateStudyRound(db,user,m,failed.sessionId,'boss');
  assert.equal(result.passed,false); assert.equal(result.score,50);
  await reject(() => recordRoundAttempt(db,user,m,m.questions[2],0,failed.sessionId));
  assert.equal((await evaluateStudyRound(db,user,m,failed.sessionId,'boss')).replayed,true);
  const passed = await startStudyRound(db,user,m); await fill(db,m,passed.sessionId,[0,0,0,1]);
  assert.equal((await evaluateStudyRound(db,user,m,passed.sessionId,'boss')).passed,true);
});

test('aula normal mantém retomada histórica; revisão não aproveita a mesma evidência', async (t) => {
  const { sql, db } = await setup(t); const m = mission('fixture.lesson','lesson'); historical(sql,m,0);
  const normal = await startStudyRound(db,user,m);
  assert.equal((await evaluateStudyRound(db,user,m,normal.sessionId,'lesson')).passed,true);
  const reviewId = addReview(sql,m); const review = await startStudyRound(db,user,m,reviewId);
  await reject(() => evaluateStudyRound(db,user,m,review.sessionId,'review',reviewId));
});

test('revisão futura, alheia, concluída ou de outra missão não abre rodada', async (t) => {
  const { sql, db } = await setup(t); const m = mission('fixture.lesson','lesson');
  const future = addReview(sql,m,1,'+1 day'); await reject(() => startStudyRound(db,user,m,future));
  const other = addReview(sql,m,2,'-1 day','outro'); await reject(() => startStudyRound(db,user,m,other),404);
  const wrongTopic = addReview(sql,mission('different'),1); await reject(() => startStudyRound(db,user,m,wrongTopic),404);
  const completed = addReview(sql,m,3); sql.prepare("UPDATE study_reviews SET status='completed' WHERE review_id=?").run(completed);
  await reject(() => startStudyRound(db,user,m,completed));
  assert.equal(count(sql,'study_sessions'),0);
});

test('respostas de uma revisão vencida não completam outro ciclo vencido', async (t) => {
  const { sql, db } = await setup(t); const m = mission('fixture.lesson','lesson');
  const one = addReview(sql,m,1); const two = addReview(sql,m,2);
  const a = await startStudyRound(db,user,m,one); const b = await startStudyRound(db,user,m,two);
  await fill(db,m,a.sessionId);
  await reject(() => evaluateStudyRound(db,user,m,a.sessionId,'review',two));
  await reject(() => evaluateStudyRound(db,user,m,b.sessionId,'review',two));
  assert.equal((await evaluateStudyRound(db,user,m,a.sessionId,'review',one)).passed,true);
});

test('rodada de aula não se transforma em revisão ou Chefe pelo endpoint', async (t) => {
  const { db } = await setup(t); const m = mission('fixture.lesson','lesson'); const r=await startStudyRound(db,user,m);
  await reject(() => evaluateStudyRound(db,user,m,r.sessionId,'review','anything'));
  await reject(() => evaluateStudyRound(db,user,m,r.sessionId,'boss'));
});

test('revisão concluída e +20 XP são atômicos e a repetição não duplica pontos', async (t) => {
  const { sql, db } = await setup(t); const m=mission('fixture.lesson','lesson'); const id=addReview(sql,m);
  const r=await startStudyRound(db,user,m,id); await fill(db,m,r.sessionId); await evaluateStudyRound(db,user,m,r.sessionId,'review',id);
  sql.exec("CREATE TRIGGER fixture_xp_fail BEFORE INSERT ON study_xp_events BEGIN SELECT RAISE(ABORT,'xp'); END");
  await assert.rejects(() => commitReviewReward(db,user,id,r.sessionId), /xp/);
  assert.equal(read(sql,'SELECT status FROM study_reviews WHERE review_id=?',id).status,'pending');
  sql.exec('DROP TRIGGER fixture_xp_fail');
  assert.equal(await commitReviewReward(db,user,id,r.sessionId),20);
  assert.equal(await commitReviewReward(db,user,id,r.sessionId),0);
  assert.equal(count(sql,'study_xp_events'),1);
  assert.equal(read(sql,'SELECT status FROM study_reviews WHERE review_id=?',id).status,'completed');
});

test('não concede XP a uma revisão sem rodada aprovada correspondente', async (t) => {
  const { sql, db } = await setup(t); const m=mission('fixture.lesson','lesson'); const id=addReview(sql,m);
  const r=await startStudyRound(db,user,m,id);
  assert.equal(await commitReviewReward(db,user,id,r.sessionId),0);
  assert.equal(count(sql,'study_xp_events'),0);
  assert.equal(read(sql,'SELECT status FROM study_reviews WHERE review_id=?',id).status,'pending');
});

test('sessão encerrada não aceita respostas nem conclusão de rodada incompleta', async (t) => {
  const { db } = await setup(t); const m=mission(); const r=await startStudyRound(db,user,m);
  await finishStudySession(db,user,r.sessionId,0);
  await reject(() => recordRoundAttempt(db,user,m,m.questions[0],0,r.sessionId));
  await reject(() => evaluateStudyRound(db,user,m,r.sessionId,'boss'));
});

test('finalizar sessão limita duração ao intervalo no servidor e é idempotente', async (t) => {
  const { sql, db } = await setup(t); const r=await startStudyRound(db,user,mission());
  sql.prepare("UPDATE study_sessions SET started_at=datetime('now','-10 seconds') WHERE session_id=?").run(r.sessionId);
  const first=await finishStudySession(db,user,r.sessionId,999999);
  assert.ok(first.durationSeconds>=10 && first.durationSeconds<=11);
  const before=read(sql,'SELECT * FROM study_sessions WHERE session_id=?',r.sessionId);
  const next=await finishStudySession(db,user,r.sessionId,2);
  assert.equal(next.durationSeconds,first.durationSeconds);
  assert.deepEqual(read(sql,'SELECT * FROM study_sessions WHERE session_id=?',r.sessionId),before);
});

test('duração inválida ou sessão de outra pessoa não altera o registro', async (t) => {
  const { sql, db } = await setup(t); const r=await startStudyRound(db,user,mission());
  for (const value of [null, undefined, false, '12', NaN, Infinity, -1]) await reject(() => finishStudySession(db,user,r.sessionId,value),400);
  await reject(() => finishStudySession(db,'outro',r.sessionId,12),404);
  assert.equal(read(sql,'SELECT status FROM study_sessions').status,'active');
});

test('resultado aprovado pode ser recuperado após encerrar a sessão', async (t) => {
  const { db } = await setup(t); const m=mission(); const r=await startStudyRound(db,user,m);
  await fill(db,m,r.sessionId); await evaluateStudyRound(db,user,m,r.sessionId,'boss');
  await finishStudySession(db,user,r.sessionId,0);
  const result=await evaluateStudyRound(db,user,m,r.sessionId,'boss');
  assert.equal(result.passed,true); assert.equal(result.replayed,true);
});

test('mudança de conteúdo exige rodada nova sem zerar tentativas existentes', async (t) => {
  const { sql, db } = await setup(t); const m=mission(); const r=await startStudyRound(db,user,m);
  await fill(db,m,r.sessionId);
  await reject(() => evaluateStudyRound(db,user,{...m,contentVersion:3},r.sessionId,'boss'));
  assert.equal(count(sql,'study_attempts'),4);
});
