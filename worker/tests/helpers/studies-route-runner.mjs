import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { sqliteD1 } from './studies-sqlite.mjs';

// O código real do roteador e do serviço é carregado sem reescrever seu texto.
// Apenas identidade autenticada e catálogo são fixtures; persistência usa SQLite.
async function fixture(t) {
  const sql = new DatabaseSync(':memory:');
  sql.exec('PRAGMA foreign_keys=ON');
  t.after(() => sql.close());
  const db = sqliteD1(sql);
  const lesson = { id:'fixture.lesson', topicId:'fixture.lesson', contentVersion:2, order:1, xp:100,
    title:'Leitura de teste', kind:'lesson', sourceIds:[], sections:[], recall:[],
    questions:Array.from({length:4},(_,i)=>({id:`lesson.${i}`,prompt:'Teste',options:['A','B'],answer:0,explanation:'Comentário de teste'})) };
  const boss = { ...lesson, id:'fixture.boss', topicId:'fixture.boss', kind:'boss', order:2, passScore:75, xp:220,
    questions:lesson.questions.map((q,i)=>({...q,id:`boss.${i}`})) };
  const missions=[lesson,boss];
  let identity={username:'wellyton',name:'Estudante sintético'};
  const context=vm.createContext({ Request,Response,URL,crypto,console });
  const auth=new vm.SyntheticModule(['validatePortalSession'], function () {
    this.setExport('validatePortalSession', async () => identity);
  }, {context});
  const exports={
    STUDY_SOURCES:[], PUBLISHED_MISSIONS:missions, PLANNED_MISSIONS:missions,
    missionById:(id)=>missions.find((m)=>m.id===id)||null,
    missionByTopicId:(id)=>missions.find((m)=>m.topicId===id)||null,
    questionById:(id)=>{for(const mission of missions){const question=mission.questions.find((q)=>q.id===id);if(question)return {mission,question};}return null;},
    sourceMap:()=>new Map()
  };
  const catalog=new vm.SyntheticModule(Object.keys(exports),function(){for(const [k,v]of Object.entries(exports))this.setExport(k,v);},{context});
  const rounds=new vm.SourceTextModule(fs.readFileSync(new URL('../../study-rounds.js',import.meta.url),'utf8'),{context});
  await rounds.link(()=>{throw new Error('Import não esperado no serviço');});await rounds.evaluate();
  const route=new vm.SourceTextModule(fs.readFileSync(new URL('../../studies.js',import.meta.url),'utf8'),{context});
  await route.link((specifier)=>{
    if(specifier==='./auth-management-flex.js')return auth;
    if(specifier==='./studies-content/manifest.js')return catalog;
    if(specifier==='./study-rounds.js')return rounds;
    throw new Error(`Import não previsto: ${specifier}`);
  });
  await route.evaluate();
  async function call(path,body, options={}) {
    identity=Object.prototype.hasOwnProperty.call(options,'identity')?options.identity:{username:'wellyton',name:'Estudante sintético'};
    const request=new Request('https://study.test/api/studies/'+path,{method:options.method||(body===undefined?'GET':'POST'),...(body!==undefined?{body:JSON.stringify(body),headers:{'Content-Type':'application/json'}}:{})});
    const response=await route.namespace.handleStudiesRoute(request,{AUTH_DB:db},'https://study.test',options.originAllowed!==false);
    return {status:response.status,body:response.status===204?null:await response.json(),headers:response.headers};
  }
  async function start(m=lesson,reviewId=null){const r=await call('sessions',{missionId:m.id,reviewId});assert.equal(r.status,201);return r.body.sessionId;}
  async function answer(m,id, choices=[]){for(let i=0;i<m.questions.length;i++){const r=await call('attempts',{sessionId:id,questionId:m.questions[i].id,selectedOption:choices[i]??0});assert.equal(r.status,200);}}
  return {sql,call,start,answer,lesson,boss};
}

test('rota mantém os gates antes de inicializar as tabelas',async t=>{
  const {sql,call}=await fixture(t);
  assert.equal((await call('bootstrap',undefined,{identity:null})).status,401);
  assert.equal((await call('bootstrap',undefined,{identity:{username:'outro'}})).status,403);
  assert.equal((await call('bootstrap',undefined,{originAllowed:false})).status,403);
  assert.equal(sql.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE type='table'").get().n,0);
});

test('bootstrap continua sem gabaritos e anuncia protocolo de rodadas',async t=>{
  const {call}=await fixture(t);const r=await call('bootstrap');
  assert.equal(r.status,200);assert.equal(r.body.roundProtocol,1);
  for(const m of r.body.missions)for(const q of m.questions){assert.equal(q.answer,undefined);assert.equal(q.explanation,undefined);}
  assert.equal(r.headers.get('Cache-Control'),'no-store');
});

test('fluxo real da rota salva tentativa única, conclui aula e preserva XP',async t=>{
  const {sql,call,start,answer,lesson}=await fixture(t);const sessionId=await start();
  await answer(lesson,sessionId);
  const duplicate=await call('attempts',{sessionId,questionId:lesson.questions[0].id,selectedOption:0});
  assert.equal(duplicate.body.recorded,false);
  const r=await call('missions/'+lesson.id+'/complete',{sessionId});
  assert.equal(r.status,200);assert.equal(r.body.xpGranted,100);assert.equal(r.body.newAchievements.length,1);
  const replay=await call('missions/'+lesson.id+'/complete',{sessionId});
  assert.equal(replay.status,200);assert.equal(replay.body.xpGranted,0);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_attempts').get().n,4);
});

test('Chefe reprova uma rodada e não concede conquista nem XP indevido',async t=>{
  const {sql,call,start,answer,boss}=await fixture(t);const id=await start(boss);await answer(boss,id,[0,0,1,1]);
  const r=await call('missions/'+boss.id+'/complete',{sessionId:id});
  assert.equal(r.status,422);assert.equal(r.body.score,50);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_xp_events').get().n,0);
  const next=await start(boss);await answer(boss,next,[0,0,0,1]);
  const passed=await call('missions/'+boss.id+'/complete',{sessionId:next});
  assert.equal(passed.body.score,75);assert.equal(passed.body.xpGranted,220);
  assert.ok(passed.body.newAchievements.some(a=>a.id==='study.sfn.boss'));
});

test('rota exige nova rodada de revisão e credita uma única vez',async t=>{
  const {sql,call,start,answer,lesson}=await fixture(t);const normal=await start();await answer(lesson,normal);
  await call('missions/'+lesson.id+'/complete',{sessionId:normal});
  const review=sql.prepare('SELECT review_id FROM study_reviews WHERE cycle=1').get();
  sql.prepare("UPDATE study_reviews SET due_at=datetime('now','-1 day') WHERE review_id=?").run(review.review_id);
  assert.equal((await call('reviews/'+review.review_id+'/complete',{sessionId:normal})).status,409);
  const round=await start(lesson,review.review_id);
  assert.equal((await call('reviews/'+review.review_id+'/complete',{sessionId:round})).status,409);
  await answer(lesson,round);
  const first=await call('reviews/'+review.review_id+'/complete',{sessionId:round});
  assert.equal(first.status,200);assert.equal(first.body.xpGranted,20);
  assert.equal((await call('reviews/'+review.review_id+'/complete',{sessionId:round})).body.xpGranted,0);
});

test('clientes antigos recebem erro explícito; JSON inválido não vira resposta zero',async t=>{
  const {sql,call,start,lesson}=await fixture(t);await start();
  const missing=await call('attempts',{questionId:lesson.questions[0].id,selectedOption:0});
  assert.equal(missing.status,409);assert.equal(missing.body.code,'STUDY_ROUND_REQUIRED');
  assert.equal((await call('sessions',null)).status,400);
  assert.equal((await call('sessions',[])).status,400);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_attempts').get().n,0);
});

test('fechar sessão por PATCH é idempotente e rejeita duração inválida',async t=>{
  const {call,start}=await fixture(t);const id=await start();
  assert.equal((await call('sessions/'+id,{durationSeconds:null},{method:'PATCH'})).status,400);
  const r=await call('sessions/'+id,{durationSeconds:0},{method:'PATCH'});assert.equal(r.status,200);
  assert.equal((await call('sessions/'+id,{durationSeconds:0},{method:'PATCH'})).status,200);
});

test('checkpoint mantém sessão ativa, total no dashboard e não gera recompensa',async t=>{
  const {sql,call,start,lesson}=await fixture(t);const id=await start();
  sql.prepare("UPDATE study_sessions SET started_at=datetime('now','-120 seconds') WHERE session_id=?").run(id);
  assert.equal((await call('bootstrap')).body.timeProtocol,1);
  const checkpoint=await call('sessions/'+id+'/checkpoint',{durationSeconds:60});
  assert.equal(checkpoint.status,200);assert.equal(checkpoint.body.finished,false);assert.equal(checkpoint.body.durationSeconds,60);
  assert.equal(sql.prepare('SELECT status FROM study_sessions WHERE session_id=?').get(id).status,'active');
  let dashboard=await call('bootstrap');assert.equal(dashboard.body.metrics.hoursSeconds,60);
  assert.equal(dashboard.body.metrics.xp,0);assert.equal(dashboard.body.metrics.questions,0);
  assert.equal((await call('missions/'+lesson.id+'/complete',{sessionId:id})).status,409);
  await call('sessions/'+id,{durationSeconds:60},{method:'PATCH'});
  dashboard=await call('bootstrap');assert.equal(dashboard.body.metrics.hoursSeconds,60);
});

test('checkpoint respeita autorização antes de inicializar o schema',async t=>{
  const {sql,call}=await fixture(t);const path='sessions/'+crypto.randomUUID()+'/checkpoint';
  assert.equal((await call(path,{durationSeconds:30},{identity:null})).status,401);
  assert.equal((await call(path,{durationSeconds:30},{identity:{username:'outro'}})).status,403);
  assert.equal((await call(path,{durationSeconds:30},{originAllowed:false})).status,403);
  assert.equal(sql.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE type='table'").get().n,0);
});

test('nova rota rejeita payload inválido e não reabre sessão encerrada',async t=>{
  const {sql,call,start}=await fixture(t);const id=await start();
  const path='sessions/'+id+'/checkpoint';
  for(const body of [null,[],{}, {durationSeconds:'30'}])assert.equal((await call(path,body)).status,400);
  await call('sessions/'+id,{durationSeconds:0},{method:'PATCH'});
  const receipt=await call(path,{durationSeconds:90});
  assert.equal(receipt.status,200);assert.equal(receipt.body.finished,true);assert.equal(receipt.body.durationSeconds,0);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_xp_events').get().n,0);
});
