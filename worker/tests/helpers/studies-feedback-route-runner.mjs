import test from 'node:test';import assert from 'node:assert/strict';import {fixture} from './studies-route-fixture.mjs';
test('real router bootstrap discloses feedback only after confirmed attempt and preserves gates',async t=>{
 const f=await fixture(t),q=f.lesson.questions[0];q.optionRationales=['Correct synthetic reason','Wrong synthetic reason'];f.lesson.teaching={questionCoverage:{[q.id]:[{missionId:f.lesson.id,sectionId:'synthetic-teaching'}]}};
 const id=await f.start();let boot=await f.call('bootstrap');assert.equal(boot.body.resumableSession.answerFeedback.length,0);
 const denied=await f.call('attempts',{sessionId:id,questionId:q.id,selectedOption:9});assert.equal(denied.status,400);boot=await f.call('bootstrap');assert.equal(boot.body.resumableSession.answerFeedback.length,0);
 const answer=await f.call('attempts',{sessionId:id,questionId:q.id,selectedOption:1});assert.equal(answer.status,200);assert.equal(answer.body.selectedFeedback,'Wrong synthetic reason');
 boot=await f.call('bootstrap');const receipt=boot.body.resumableSession.answerFeedback[0];assert.equal(receipt.questionId,q.id);assert.equal(receipt.selectedOption,1);assert.equal(receipt.correct,false);assert.equal(receipt.explanation,answer.body.explanation);assert.deepEqual(receipt.reviewRefs,answer.body.reviewRefs);assert.equal(receipt.sessionId,id);assert.equal(receipt.contentVersion,f.lesson.contentVersion);
 assert.equal(boot.body.missions[0].questions[0].answer,undefined);assert.equal(boot.body.missions[0].questions[0].explanation,undefined);assert.equal(boot.body.resumableSession.answerFeedback.length,1);
 for(const identity of [null,{username:'other-user'}]){const r=await f.call('bootstrap',undefined,{identity});assert.equal(r.status,identity?403:401);assert.equal(r.body.resumableSession,undefined);}
 assert.equal((await f.call('bootstrap',undefined,{originAllowed:false})).status,403);
 assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM study_xp_events').get().n,0);
 assert.equal((await f.call('attempts',{sessionId:id,questionId:q.id,selectedOption:1})).body.recorded,false);assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM study_attempts').get().n,1);
});
test('real router suppresses completed, stale or corrupt resumable feedback without clearing progress',async t=>{
 const f=await fixture(t),q=f.lesson.questions[0],id=await f.start();await f.call('attempts',{sessionId:id,questionId:q.id,selectedOption:0});
 const before=f.sql.prepare('SELECT COUNT(*) n FROM study_attempts').get().n;
 f.lesson.contentVersion++;let boot=await f.call('bootstrap');assert.equal(boot.body.resumableSession,null);f.lesson.contentVersion--;
 f.sql.prepare('UPDATE study_rounds SET question_ids=? WHERE session_id=?').run('corrupt',id);boot=await f.call('bootstrap');assert.equal(boot.body.resumableSession,null);
 f.sql.prepare('UPDATE study_rounds SET question_ids=? WHERE session_id=?').run(JSON.stringify(f.lesson.questions.map(q=>q.id)),id);
 assert.equal((await f.call('sessions/'+id,{durationSeconds:0},{method:'PATCH'})).status,200);assert.equal((await f.call('bootstrap')).body.resumableSession,null);assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM study_attempts').get().n,before);
});
