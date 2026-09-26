import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { sqliteD1 } from './helpers/studies-sqlite.mjs';
import { checkpointStudySession, finishStudySession, StudyRoundError } from '../study-rounds.js';

function fixture(t, modifier = '-120 seconds') {
  const sql = new DatabaseSync(':memory:');t.after(()=>sql.close());
  sql.exec(`CREATE TABLE study_sessions(session_id TEXT PRIMARY KEY, username TEXT NOT NULL,
    mission_id TEXT, started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, finished_at TEXT,
    duration_seconds INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'active');`);
  const id=randomUUID();sql.prepare("INSERT INTO study_sessions(session_id,username,started_at) VALUES (?,'wellyton',datetime('now',?))").run(id,modifier);
  return {sql,id,db:sqliteD1(sql),row:()=>sql.prepare('SELECT * FROM study_sessions WHERE session_id=?').get(id)};
}
const rejected = (fn,status)=>assert.rejects(fn,e=>e instanceof StudyRoundError&&e.status===status);

test('checkpoint grava total parcial sem fechar sessão',async t=>{
  const {db,id,row}=fixture(t);const result=await checkpointStudySession(db,'wellyton',id,30);
  assert.equal(result.durationSeconds,30);assert.equal(result.checkpointed,true);assert.equal(result.finished,false);
  assert.equal(result.sessionId,id);assert.equal(result.timeProtocol,1);
  assert.equal(row().status,'active');assert.equal(row().finished_at,null);
});

test('pedidos repetidos ou fora de ordem não somam nem apagam segundos',async t=>{
  const {db,id,row}=fixture(t);
  for(const value of [30,30,60,45,0])await checkpointStudySession(db,'wellyton',id,value);
  assert.equal(row().duration_seconds,60);
});

test('pedidos concorrentes convergem para o maior total aceito',async t=>{
  const {db,id,row}=fixture(t);
  await Promise.all([60,30,90,60].map(value=>checkpointStudySession(db,'wellyton',id,value)));
  assert.equal(row().duration_seconds,90);
});

test('checkpoint e fechamento seguem limite do servidor e de seis horas',async t=>{
  const small=fixture(t,'-10 seconds');const limited=await checkpointStudySession(small.db,'wellyton',small.id,999999);
  assert.ok(limited.durationSeconds>=10&&limited.durationSeconds<=11);
  const long=fixture(t,'-7 hours');const capped=await checkpointStudySession(long.db,'wellyton',long.id,999999);
  assert.equal(capped.durationSeconds,21600);
});

test('fechamento atrasado não reduz um checkpoint já persistido',async t=>{
  const {db,id,row}=fixture(t);await checkpointStudySession(db,'wellyton',id,60);
  const closed=await finishStudySession(db,'wellyton',id,30);
  assert.equal(closed.durationSeconds,60);assert.equal(row().status,'finished');
  const before=row();await finishStudySession(db,'wellyton',id,100);assert.deepEqual(row(),before);
});

test('checkpoint recebido após fechar não reabre nem acrescenta duração',async t=>{
  const {db,id,row}=fixture(t);await finishStudySession(db,'wellyton',id,30);const before=row();
  const result=await checkpointStudySession(db,'wellyton',id,90);
  assert.equal(result.finished,true);assert.equal(result.durationSeconds,30);assert.deepEqual(row(),before);
});

test('IDs alheios e duração inválida não modificam registro',async t=>{
  const {db,id,row}=fixture(t);const before=row();
  for(const value of [null,undefined,'30',false,NaN,Infinity,-1])await rejected(()=>checkpointStudySession(db,'wellyton',id,value),400);
  await rejected(()=>checkpointStudySession(db,'outro',id,30),404);
  await rejected(()=>checkpointStudySession(db,'wellyton',randomUUID(),30),404);
  assert.deepEqual(row(),before);
});

test('frações são truncadas e data futura não produz tempo negativo',async t=>{
  const a=fixture(t);assert.equal((await checkpointStudySession(a.db,'wellyton',a.id,12.99)).durationSeconds,12);
  const b=fixture(t,'+10 seconds');assert.equal((await checkpointStudySession(b.db,'wellyton',b.id,20)).durationSeconds,0);
});

test('falha de gravação não retorna confirmação nem modifica histórico',async t=>{
  const {db,sql,id,row}=fixture(t);await checkpointStudySession(db,'wellyton',id,30);
  sql.exec("CREATE TRIGGER fail_time BEFORE UPDATE ON study_sessions BEGIN SELECT RAISE(ABORT,'fixture-time'); END");
  await assert.rejects(()=>checkpointStudySession(db,'wellyton',id,60),/fixture-time/);
  assert.equal(row().duration_seconds,30);
});
