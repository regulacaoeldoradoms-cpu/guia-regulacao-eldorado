import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from './studies-route-fixture.mjs';

async function historicalLesson(f){
 const id=await f.start();await f.answer(f.lesson,id);
 assert.equal((await f.call('missions/'+f.lesson.id+'/complete',{sessionId:id})).status,200);
 await f.call('sessions/'+id,{durationSeconds:0},{method:'PATCH'});
}

test('wrong question association is excluded from active feedback and current-round summary',async t=>{
 const f=await fixture(t);await historicalLesson(f);const id=await f.start();
 await f.call('attempts',{sessionId:id,questionId:f.lesson.questions[0].id,selectedOption:0});
 const attempt=f.sql.prepare('SELECT attempt_id FROM study_round_answers WHERE session_id=?').get(id).attempt_id;
 f.sql.prepare('UPDATE study_round_answers SET question_id=? WHERE session_id=?').run(f.lesson.questions[1].id,id);
 const resumed=(await f.call('bootstrap')).body.resumableSession;
 assert.deepEqual(resumed.answerFeedback,[]);assert.deepEqual(resumed.answeredQuestionIds,[]);
 const done=await f.call('missions/'+f.lesson.id+'/complete',{sessionId:id});assert.equal(done.status,200);
 const s=done.body.studySummary;assert.equal(s.answered,0);assert.equal(s.correct,0);assert.equal(s.currentRoundScore,null);assert.equal(s.completionScore,100);assert.deepEqual(s.items,[]);
 assert.equal(f.sql.prepare('SELECT question_id FROM study_attempts WHERE attempt_id=?').get(attempt).question_id,f.lesson.questions[0].id);
 const replay=await f.call('missions/'+f.lesson.id+'/complete',{sessionId:id});assert.deepEqual(replay.body.studySummary,s);assert.equal(replay.body.xpGranted,0);
});

test('foreign owner, topic and version attempts cannot appear in an owned passed-round summary',async t=>{
 const f=await fixture(t);await historicalLesson(f);const id=await f.start();
 for(const [i,owner,topic,version]of [[0,'other-user',f.lesson.topicId,2],[1,'wellyton','foreign.topic',2],[2,'wellyton',f.lesson.topicId,1]]){
  const attempt='synthetic-foreign-'+i,q=f.lesson.questions[i].id;
  f.sql.prepare('INSERT INTO study_attempts(attempt_id,username,question_id,topic_id,content_version,selected_option,correct) VALUES(?,?,?,?,?,0,1)').run(attempt,owner,q,topic,version);
  f.sql.prepare('INSERT INTO study_round_answers(session_id,question_id,attempt_id) VALUES(?,?,?)').run(id,q,attempt);
 }
 const path='missions/'+f.lesson.id+'/complete';const done=await f.call(path,{sessionId:id});assert.equal(done.status,200);assert.equal(done.body.studySummary.answered,0);assert.deepEqual(done.body.studySummary.items,[]);
 for(const identity of [null,{username:'other-user'}]){const denied=await f.call(path,{sessionId:id},{identity});assert.equal(denied.status,identity?403:401);assert.equal(denied.body.studySummary,undefined);}
 const origin=await f.call(path,{sessionId:id},{originAllowed:false});assert.equal(origin.status,403);assert.equal(origin.body.studySummary,undefined);
});
