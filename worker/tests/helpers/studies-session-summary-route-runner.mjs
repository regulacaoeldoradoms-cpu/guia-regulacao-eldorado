import test from 'node:test';import assert from 'node:assert/strict';import {fixture} from './studies-route-fixture.mjs';
test('private completion and denied responses cannot be cached',async t=>{
 const f=await fixture(t),id=await f.start();await f.answer(f.lesson,id);
 const path='missions/'+f.lesson.id+'/complete';
 for(const options of [{},{identity:null},{identity:{username:'other'}},{originAllowed:false}]){
  const r=await f.call(path,{sessionId:id},options);
  assert.equal(r.headers.get('Cache-Control'),'no-store');assert.equal(r.headers.get('X-Content-Type-Options'),'nosniff');
  if(Object.keys(options).length)assert.equal(r.body.studySummary,undefined);else assert.equal(r.body.studySummary.sessionId,id);
 }
});
test('lesson summary separates this round from historic best score and is replayable',async t=>{
 const f=await fixture(t),first=await f.start();await f.answer(f.lesson,first);
 const done=await f.call('missions/'+f.lesson.id+'/complete',{sessionId:first});assert.equal(done.status,200);assert.equal(done.body.studySummary.answered,4);
 await f.call('sessions/'+first,{durationSeconds:0},{method:'PATCH'});
 const id=await f.start();await f.call('attempts',{sessionId:id,questionId:f.lesson.questions[0].id,selectedOption:1});
 const before=f.sql.prepare('SELECT COUNT(*) n FROM study_attempts').get().n;
 const r=await f.call('missions/'+f.lesson.id+'/complete',{sessionId:id});assert.equal(r.status,200);
 const s=r.body.studySummary;assert.equal(s.protocol,1);assert.equal(s.sessionId,id);assert.equal(s.contentVersion,2);
 assert.equal(s.total,4);assert.equal(s.answered,1);assert.equal(s.correct,0);assert.equal(s.currentRoundScore,0);assert.equal(s.completionScore,100);assert.equal(s.completionMayUseHistory,true);
 assert.equal(s.items.length,1);assert.equal(s.items[0].correct,false);assert.equal(s.items[0].questionId,f.lesson.questions[0].id);
 assert.equal(s.items[0].explanation,f.lesson.questions[0].explanation);assert.equal(r.body.xpGranted,0);
 const replay=await f.call('missions/'+f.lesson.id+'/complete',{sessionId:id});assert.equal(replay.status,200);assert.deepEqual(replay.body.studySummary,s);assert.equal(replay.body.xpGranted,0);
 assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM study_attempts').get().n,before);
 const boot=await f.call('bootstrap');assert.equal(boot.body.studySummary,undefined);assert.equal(boot.body.missions[0].questions[0].explanation,undefined);
});
test('summary completion preserves identity, origin, version and round gates',async t=>{
 const f=await fixture(t),id=await f.start(),path='missions/'+f.lesson.id+'/complete';
 for(const identity of [null,{username:'other'}]){const r=await f.call(path,{sessionId:id},{identity});assert.equal(r.status,identity?403:401);assert.equal(r.body.studySummary,undefined);}
 assert.equal((await f.call(path,{sessionId:id},{originAllowed:false})).status,403);
 assert.equal((await f.call(path,{sessionId:id})).status,409);
 await f.answer(f.lesson,id);f.lesson.contentVersion++;const stale=await f.call(path,{sessionId:id});assert.equal(stale.status,409);assert.equal(stale.body.studySummary,undefined);
});
test('zero-correct review gets current session summary without mastery claims or duplicate rewards',async t=>{
 const f=await fixture(t);await f.call('bootstrap');f.sql.prepare(`INSERT INTO study_reviews(review_id,username,topic_id,cycle,due_at) VALUES('00000000-0000-4000-8000-000000000286','wellyton',?,1,datetime('now','-1 day'))`).run(f.lesson.topicId);
 const review='00000000-0000-4000-8000-000000000286',id=await f.start(f.lesson,review);await f.answer(f.lesson,id,[1,1,1,1]);
 const r=await f.call('reviews/'+review+'/complete',{sessionId:id});assert.equal(r.status,200);assert.equal(r.body.studySummary.mode,'review');assert.equal(r.body.studySummary.correct,0);assert.equal(r.body.studySummary.answered,4);assert.equal(r.body.studySummary.currentRoundScore,0);assert.equal(r.body.studySummary.completionMayUseHistory,false);
 const replay=await f.call('reviews/'+review+'/complete',{sessionId:id});assert.equal(replay.status,200);assert.deepEqual(replay.body.studySummary,r.body.studySummary);assert.equal(replay.body.xpGranted,0);
});
test('failed boss returns existing gate error without completion summary',async t=>{
 const f=await fixture(t),lesson=await f.start();await f.answer(f.lesson,lesson);await f.call('missions/'+f.lesson.id+'/complete',{sessionId:lesson});await f.call('sessions/'+lesson,{durationSeconds:0},{method:'PATCH'});
 const id=await f.start(f.boss);await f.answer(f.boss,id,[1,1,1,1]);const r=await f.call('missions/'+f.boss.id+'/complete',{sessionId:id});assert.equal(r.status,422);assert.equal(r.body.studySummary,undefined);
});
