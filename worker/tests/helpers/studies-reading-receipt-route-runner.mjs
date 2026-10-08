import test from 'node:test';import assert from 'node:assert/strict';import {fixture} from './studies-route-fixture.mjs';
const count=(f,table)=>f.sql.prepare(`SELECT COUNT(*) n FROM ${table}`).get().n;
test('session receipt is independent from historic coverage and remains idempotent',async t=>{
  const f=await fixture(t),id=await f.start();
  f.sql.prepare(`UPDATE study_topic_progress SET coverage_state=2,content_version_seen=? WHERE username='wellyton' AND topic_id=?`).run(f.lesson.contentVersion,f.lesson.topicId);
  // Session start need not create topic progress: insert historic evidence if absent.
  f.sql.prepare(`INSERT OR IGNORE INTO study_topic_progress(username,topic_id,coverage_state,content_version_seen) VALUES('wellyton',?,2,?)`).run(f.lesson.topicId,f.lesson.contentVersion);
  let boot=await f.call('bootstrap');assert.equal(boot.body.readingReceiptProtocol,1);assert.equal(boot.body.resumableSession.readingComplete,false);
  assert.equal(boot.body.resumableSession.readingConfirmedAt,null);
  const first=await f.call('sessions/'+id+'/reading-complete',{});assert.equal(first.status,200);assert.equal(first.body.readingComplete,true);assert.equal(first.body.readingRecorded,true);assert.equal(first.body.recorded,false);assert.equal(first.body.coverageState,2);
  const replay=await f.call('sessions/'+id+'/reading-complete',{});assert.equal(replay.status,200);assert.equal(replay.body.readingRecorded,false);assert.equal(replay.body.readingConfirmedAt,first.body.readingConfirmedAt);assert.equal(count(f,'study_reading_receipts'),1);
  boot=await f.call('bootstrap');assert.equal(boot.body.resumableSession.readingComplete,true);assert.equal(boot.body.resumableSession.readingConfirmedAt,first.body.readingConfirmedAt);
  assert.equal(count(f,'study_attempts'),0);assert.equal(count(f,'study_xp_events'),0);
  await f.call('sessions/'+id,{durationSeconds:0},{method:'PATCH'});const next=await f.start();assert.notEqual(next,id);boot=await f.call('bootstrap');assert.equal(boot.body.resumableSession.sessionId,next);assert.equal(boot.body.resumableSession.readingComplete,false);
});
test('reading route rejects foreign identity, origin, stale version and corrupt round without receipts',async t=>{
  const f=await fixture(t),id=await f.start(),path='sessions/'+id+'/reading-complete';
  for(const identity of [null,{username:'other-user'}])assert.equal((await f.call(path,{}, {identity})).status,identity?403:401);
  assert.equal((await f.call(path,{}, {originAllowed:false})).status,403);
  f.lesson.contentVersion++;assert.equal((await f.call(path,{})).status,409);assert.equal((await f.call('bootstrap')).body.resumableSession,null);f.lesson.contentVersion--;
  f.sql.prepare('UPDATE study_rounds SET question_ids=? WHERE session_id=?').run('corrupt',id);assert.equal((await f.call(path,{})).status,409);
  f.sql.prepare('UPDATE study_rounds SET question_ids=? WHERE session_id=?').run(JSON.stringify(f.lesson.questions.map(q=>q.id)),id);
  f.sql.prepare('UPDATE study_rounds SET username=? WHERE session_id=?').run('other-user',id);assert.equal((await f.call(path,{})).status,404);
  f.sql.prepare('UPDATE study_rounds SET username=? WHERE session_id=?').run('wellyton',id);
  await f.call('sessions/'+id,{durationSeconds:0},{method:'PATCH'});assert.equal((await f.call(path,{})).status,409);
  assert.equal(count(f,'study_reading_receipts'),0);assert.equal(count(f,'study_attempts'),0);assert.equal(count(f,'study_xp_events'),0);
});
test('explicit review reading gets a receipt without creating coverage or rewards',async t=>{
  const f=await fixture(t);await f.call('bootstrap');
  f.sql.prepare(`INSERT INTO study_reviews(review_id,username,topic_id,cycle,due_at) VALUES('synthetic-review','wellyton',?,1,datetime('now','-1 day'))`).run(f.lesson.topicId);
  const id=await f.start(f.lesson,'synthetic-review'),r=await f.call('sessions/'+id+'/reading-complete',{});
  assert.equal(r.status,200);assert.equal(r.body.readingComplete,true);assert.equal(r.body.readingRecorded,true);assert.equal(r.body.recorded,false);assert.equal(r.body.coverageState,0);
  assert.equal(count(f,'study_topic_progress'),0);assert.equal(count(f,'study_xp_events'),0);assert.equal((await f.call('bootstrap')).body.resumableSession.readingComplete,true);
});
test('reading receipt and coverage roll back together on storage failure',async t=>{
  const f=await fixture(t),id=await f.start();
  f.sql.exec(`CREATE TRIGGER reject_reading_progress BEFORE INSERT ON study_topic_progress BEGIN SELECT RAISE(ABORT,'synthetic storage failure'); END`);
  await assert.rejects(f.call('sessions/'+id+'/reading-complete',{}),/synthetic storage failure/);
  assert.equal(count(f,'study_reading_receipts'),0);assert.equal(count(f,'study_topic_progress'),0);
  f.sql.exec('DROP TRIGGER reject_reading_progress');const retry=await f.call('sessions/'+id+'/reading-complete',{});assert.equal(retry.status,200);assert.equal(retry.body.readingComplete,true);assert.equal(retry.body.recorded,true);
});
test('session closure before the transaction prevents receipt and coverage writes',async t=>{
  const f=await fixture(t),id=await f.start(),original=f.db.batch.bind(f.db);let raced=false;
  f.db.batch=async statements=>{if(!raced&&statements.some(s=>s.sql.includes('INSERT OR IGNORE INTO study_reading_receipts'))){raced=true;f.sql.prepare(`UPDATE study_sessions SET status='finished' WHERE session_id=?`).run(id);}return original(statements);};
  const r=await f.call('sessions/'+id+'/reading-complete',{});assert.equal(r.status,409);assert.equal(raced,true);assert.equal(count(f,'study_reading_receipts'),0);assert.equal(count(f,'study_topic_progress'),0);assert.equal(count(f,'study_xp_events'),0);
});
test('a foreign or stale stored receipt is suppressed and cannot create coverage',async t=>{
  const f=await fixture(t),id=await f.start();
  f.sql.prepare(`INSERT INTO study_reading_receipts(session_id,username,mission_id,content_version) VALUES(?,?,?,?)`).run(id,'other-user',f.lesson.id,f.lesson.contentVersion);
  assert.equal((await f.call('bootstrap')).body.resumableSession.readingComplete,false);
  const r=await f.call('sessions/'+id+'/reading-complete',{});assert.equal(r.status,409);assert.equal(count(f,'study_topic_progress'),0);
  f.sql.prepare('UPDATE study_reading_receipts SET username=?,content_version=? WHERE session_id=?').run('wellyton',f.lesson.contentVersion-1,id);
  assert.equal((await f.call('bootstrap')).body.resumableSession.readingComplete,false);
  assert.equal((await f.call('sessions/'+id+'/reading-complete',{})).status,409);assert.equal(count(f,'study_topic_progress'),0);
  f.sql.prepare('UPDATE study_reading_receipts SET content_version=?,confirmed_at=? WHERE session_id=?').run(f.lesson.contentVersion,'invalid-date',id);
  assert.equal((await f.call('bootstrap')).body.resumableSession.readingComplete,false);
  assert.equal((await f.call('sessions/'+id+'/reading-complete',{})).status,409);assert.equal(count(f,'study_topic_progress'),0);
  assert.equal(count(f,'study_attempts'),0);assert.equal(count(f,'study_xp_events'),0);
});
