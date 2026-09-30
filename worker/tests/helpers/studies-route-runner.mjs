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
    sourceMap:()=>new Map(),
    publicationSnapshot:()=>({
      baselineReleaseSequence:1,currentRelease:'fixture-r1',currentReleaseSequence:1,
      newCount:0,newMissionIds:[],revisionRecommendedCount:0,revisionRecommendedIds:[]
    })
  };
  const catalog=new vm.SyntheticModule(Object.keys(exports),function(){for(const [k,v]of Object.entries(exports))this.setExport(k,v);},{context});
  const curriculum=new vm.SyntheticModule(['curriculumSnapshot'],function(){
    this.setExport('curriculumSnapshot',()=>({
      version:1,basis:'fixture',totalAreas:0,startedAreas:0,completedAreas:0,
      totalBlocks:0,publishedBlocks:0,completedBlocks:0,availabilityPercent:0,progressPercent:0,
      readiness:{status:'not_measured',label:'Ainda não medida',explanation:'fixture'},areas:[]
    }));
  },{context});
  const rounds=new vm.SourceTextModule(fs.readFileSync(new URL('../../study-rounds.js',import.meta.url),'utf8'),{context});
  await rounds.link(()=>{throw new Error('Import não esperado no serviço de rodadas');});await rounds.evaluate();
  const assessmentContent=new vm.SourceTextModule(fs.readFileSync(new URL('../../studies-assessment-content/sfn-foundation-v1.js',import.meta.url),'utf8'),{context});
  await assessmentContent.link(()=>{throw new Error('Import não esperado no conteúdo de avaliação');});await assessmentContent.evaluate();
  const assessments=new vm.SourceTextModule(fs.readFileSync(new URL('../../study-assessments.js',import.meta.url),'utf8'),{context});
  await assessments.link((specifier)=>{
    if(specifier==='./studies-assessment-content/sfn-foundation-v1.js')return assessmentContent;
    throw new Error(`Import não previsto na avaliação: ${specifier}`);
  });await assessments.evaluate();
  const questionFeedback=new vm.SourceTextModule(fs.readFileSync(new URL('../../studies-content/question-feedback-v1.js',import.meta.url),'utf8'),{context});
  await questionFeedback.link(()=>{throw new Error('Import não esperado no feedback de questões');});await questionFeedback.evaluate();
  const route=new vm.SourceTextModule(fs.readFileSync(new URL('../../studies.js',import.meta.url),'utf8'),{context});
  await route.link((specifier)=>{
    if(specifier==='./auth-management-flex.js')return auth;
    if(specifier==='./studies-content/manifest.js')return catalog;
    if(specifier==='./studies-content/curriculum-v1.js')return curriculum;
    if(specifier==='./studies-content/question-feedback-v1.js')return questionFeedback;
    if(specifier==='./study-rounds.js')return rounds;
    if(specifier==='./study-assessments.js')return assessments;
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
  assert.equal(r.status,200);assert.equal(r.body.roundProtocol,1);assert.equal(r.body.assessmentProtocol,1);
  assert.equal(r.body.publicationProtocol,1);assert.equal(r.body.publication.newCount,0);
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

test('backend bloqueia missão futura até concluir o pré-requisito',async t=>{
  const {sql,call,start,answer,lesson,boss}=await fixture(t);
  const locked=await call('sessions',{missionId:boss.id});
  assert.equal(locked.status,409);
  assert.equal(locked.body.code,'STUDY_PREREQUISITE_REQUIRED');
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_sessions').get().n,0);

  const prerequisite=await start(lesson);await answer(lesson,prerequisite);
  const completed=await call('missions/'+lesson.id+'/complete',{sessionId:prerequisite});
  assert.equal(completed.status,200);
  assert.equal((await call('sessions/'+prerequisite,{durationSeconds:0},{method:'PATCH'})).status,200);

  const unlocked=await call('sessions',{missionId:boss.id});
  assert.equal(unlocked.status,201);
});

test('fechamento revalida pré-requisito até para sessão antiga de missão futura',async t=>{
  const {sql,call,boss}=await fixture(t);
  await call('bootstrap');
  const sessionId=crypto.randomUUID();
  sql.prepare('INSERT INTO study_sessions(session_id, username, mission_id) VALUES (?, ?, ?)').run(sessionId,'wellyton',boss.id);
  sql.prepare(`INSERT INTO study_rounds(session_id, username, mission_id, mode, review_id,
    content_version, question_ids, pass_score) VALUES (?, ?, ?, 'boss', NULL, ?, ?, ?)`)
    .run(sessionId,'wellyton',boss.id,boss.contentVersion,JSON.stringify(boss.questions.map(q=>q.id)),boss.passScore);
  const blocked=await call('missions/'+boss.id+'/complete',{sessionId});
  assert.equal(blocked.status,409);
  assert.equal(blocked.body.code,'STUDY_PREREQUISITE_REQUIRED');
  assert.equal(sql.prepare('SELECT status FROM study_rounds WHERE session_id=?').get(sessionId).status,'active');
  assert.equal(sql.prepare('SELECT coverage_state FROM study_topic_progress WHERE username=? AND topic_id=?').get('wellyton',boss.topicId),undefined);
});

test('Chefe reprova uma rodada e não concede conquista nem XP indevido',async t=>{
  const {sql,call,start,answer,lesson,boss}=await fixture(t);
  const prerequisite=await start(lesson);await answer(lesson,prerequisite);
  assert.equal((await call('missions/'+lesson.id+'/complete',{sessionId:prerequisite})).status,200);
  assert.equal((await call('sessions/'+prerequisite,{durationSeconds:0},{method:'PATCH'})).status,200);
  const xpBeforeBoss=sql.prepare('SELECT COUNT(*) n FROM study_xp_events').get().n;
  const achievementsBeforeBoss=sql.prepare('SELECT COUNT(*) n FROM study_achievements').get().n;
  const id=await start(boss);await answer(boss,id,[0,0,1,1]);
  const r=await call('missions/'+boss.id+'/complete',{sessionId:id});
  assert.equal(r.status,422);assert.equal(r.body.score,50);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_xp_events').get().n,xpBeforeBoss);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_achievements').get().n,achievementsBeforeBoss);
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

test('três revisões atrasadas continuam disponíveis juntas e nota zero conclui apenas ciclos',async t=>{
  const {sql,call,start,answer,lesson}=await fixture(t);
  const normal=await start();
  await answer(lesson,normal,[1,1,1,1]);
  const completionStartedAt=sql.prepare("SELECT unixepoch('now') now").get().now;
  assert.equal((await call('missions/'+lesson.id+'/complete',{sessionId:normal})).status,200);
  const completionEndedAt=sql.prepare("SELECT unixepoch('now') now").get().now;
  assert.equal((await call('sessions/'+normal,{durationSeconds:0},{method:'PATCH'})).status,200);
  const initial=(await call('bootstrap')).body;
  const initialAchievements=sql.prepare('SELECT * FROM study_achievements ORDER BY achievement_id').all();
  const initialAttempts=sql.prepare('SELECT * FROM study_attempts ORDER BY attempt_id').all();
  assert.equal(initial.metrics.reviewsDue,0);

  const schedule=sql.prepare('SELECT cycle,unixepoch(due_at) scheduledAt FROM study_reviews ORDER BY cycle').all();
  assert.deepEqual(schedule.map(row=>row.cycle),[1,2,3]);
  for(const [index,row] of schedule.entries()){
    const delay=[1,7,30][index]*86400;
    assert.ok(row.scheduledAt>=completionStartedAt+delay && row.scheduledAt<=completionEndedAt+delay);
  }
  // Apenas a fixture envelhece o calendário em 40 dias; o produto mantém os prazos originais.
  sql.prepare("UPDATE study_reviews SET due_at=datetime(due_at,'-40 days')").run();
  const overdue=sql.prepare('SELECT review_id,cycle,due_at FROM study_reviews ORDER BY cycle').all();
  const allDue=(await call('bootstrap')).body;
  assert.equal(allDue.metrics.reviewsDue,3);
  assert.deepEqual(allDue.reviews.map(review=>review.id),overdue.map(review=>review.review_id));

  for(const [index,review] of overdue.entries()){
    const sessionId=await start(lesson,review.review_id);
    const questionIds=JSON.parse(sql.prepare('SELECT question_ids FROM study_rounds WHERE session_id=?').get(sessionId).question_ids);
    assert.deepEqual(questionIds,lesson.questions.map(question=>question.id));
    await answer(lesson,sessionId,[1,1,1,1]);
    const completed=await call('reviews/'+review.review_id+'/complete',{sessionId});
    assert.equal(completed.status,200);
    assert.equal(completed.body.xpGranted,20);
    const replay=await call('reviews/'+review.review_id+'/complete',{sessionId});
    assert.equal(replay.status,200);
    assert.equal(replay.body.xpGranted,0);
    assert.equal((await call('sessions/'+sessionId,{durationSeconds:0},{method:'PATCH'})).status,200);
    const round=sql.prepare('SELECT score,status FROM study_rounds WHERE session_id=?').get(sessionId);
    assert.equal(round.score,0);
    assert.equal(round.status,'passed');

    const bootstrap=(await call('bootstrap')).body;
    assert.equal(bootstrap.metrics.reviewsDue,2-index);
    assert.deepEqual(bootstrap.reviews.map(item=>item.id),overdue.slice(index+1).map(item=>item.review_id));
    assert.equal(bootstrap.progress[lesson.topicId].coverageState,3);
    assert.equal(bootstrap.progress[lesson.topicId].completedAt,initial.progress[lesson.topicId].completedAt);
    assert.equal(bootstrap.progress[lesson.topicId].contentVersionSeen,initial.progress[lesson.topicId].contentVersionSeen);
    assert.equal(bootstrap.learningEvidence[lesson.topicId].scoredCycles,index+1);
    assert.equal(bootstrap.learningEvidence[lesson.topicId].latestScore,0);
    assert.equal(bootstrap.recentDomain.byTopic[lesson.topicId].score,0);
    assert.equal(bootstrap.recentDomain.byTopic[lesson.topicId].retentionScore,0);
    assert.deepEqual(bootstrap.curriculum.readiness,initial.curriculum.readiness);
    assert.equal(bootstrap.pedagogicalStates[lesson.topicId].id,index===2?'consolidated':'review');
    // Concluir um ciclo não reagenda nenhum dos demais.
    assert.deepEqual(sql.prepare('SELECT review_id,cycle,due_at FROM study_reviews ORDER BY cycle').all(),overdue);
  }

  const final=(await call('bootstrap')).body;
  assert.equal(final.pedagogicalStates[lesson.topicId].label,'Ciclos concluídos');
  assert.match(final.pedagogicalStates[lesson.topicId].explanation,/não comprova domínio nem prontidão/);
  assert.equal(final.metrics.xp,initial.metrics.xp+60);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_attempts').get().n,16);
  for(const attempt of initialAttempts){
    assert.deepEqual(sql.prepare('SELECT * FROM study_attempts WHERE attempt_id=?').get(attempt.attempt_id),attempt);
  }
  assert.deepEqual(sql.prepare('SELECT * FROM study_achievements ORDER BY achievement_id').all(),initialAchievements);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_assessment_rounds').get().n,0);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_assessment_answers').get().n,0);
});

test('bootstrap oferece retomada da rodada ativa com respostas já registradas',async t=>{
  const {sql,call,start,lesson}=await fixture(t);
  const id=await start(lesson);
  await call('attempts',{sessionId:id,questionId:lesson.questions[0].id,selectedOption:0});
  await call('attempts',{sessionId:id,questionId:lesson.questions[1].id,selectedOption:0});
  sql.prepare('UPDATE study_sessions SET duration_seconds=75 WHERE session_id=?').run(id);
  const r=await call('bootstrap');
  assert.equal(r.status,200);
  assert.equal(r.body.resumeProtocol,1);
  assert.equal(r.body.resumableSession.sessionId,id);
  assert.equal(r.body.resumableSession.missionId,lesson.id);
  assert.equal(r.body.resumableSession.mode,'lesson');
  assert.equal(r.body.resumableSession.durationSeconds,75);
  assert.deepEqual(r.body.resumableSession.answeredQuestionIds,[lesson.questions[0].id,lesson.questions[1].id]);
});

test('nova rodada é bloqueada enquanto há sessão elegível para retomada',async t=>{
  const {sql,call,start,lesson}=await fixture(t);
  const id=await start(lesson);
  const blocked=await call('sessions',{missionId:lesson.id});
  assert.equal(blocked.status,409);
  assert.equal(blocked.body.code,'STUDY_SESSION_RESUME_REQUIRED');
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_sessions').get().n,1);
  assert.equal((await call('bootstrap')).body.resumableSession.sessionId,id);
});

test('sessão encerrada deixa de ser oferecida para retomada',async t=>{
  const {call,start,lesson}=await fixture(t);
  const id=await start(lesson);
  assert.equal((await call('bootstrap')).body.resumableSession.sessionId,id);
  assert.equal((await call('sessions/'+id,{durationSeconds:0},{method:'PATCH'})).status,200);
  assert.equal((await call('bootstrap')).body.resumableSession,null);
});

test('sessão ativa antiga não é sugerida como retomada automática',async t=>{
  const {sql,call,start,lesson}=await fixture(t);
  const id=await start(lesson);
  sql.prepare("UPDATE study_sessions SET started_at=datetime('now','-13 hours') WHERE session_id=?").run(id);
  const r=await call('bootstrap');
  assert.equal(r.body.resumableSession,null);
  assert.equal(sql.prepare('SELECT status FROM study_sessions WHERE session_id=?').get(id).status,'active');
});

test('missão comum e avaliação independente não podem ficar ativas ao mesmo tempo',async t=>{
  const {sql,call,start,lesson}=await fixture(t);
  const topics=[
    'banking.sfn.introducao','banking.sfn.cmn','banking.sfn.bacen','banking.sfn.copom',
    'banking.sfn.cvm','banking.sfn.operadores','banking.sfn.seguros-previdencia',
    'banking.sfn.pagamentos-consorcios','banking.sfn.boss'
  ];
  await call('bootstrap');
  const insert=sql.prepare(`INSERT INTO study_topic_progress(
    username, topic_id, coverage_state, mastery_score, content_version_seen
  ) VALUES ('wellyton', ?, 3, 0, 2)`);
  for(const topic of topics)insert.run(topic);

  const sessionId=await start(lesson);
  const blockedAssessment=await call('assessments/banking.sfn-foundation/start',{});
  assert.equal(blockedAssessment.status,409);
  assert.equal(blockedAssessment.body.code,'STUDY_SESSION_RESUME_REQUIRED');
  assert.equal((await call('sessions/'+sessionId,{durationSeconds:0},{method:'PATCH'})).status,200);

  const assessment=await call('assessments/banking.sfn-foundation/start',{});
  assert.equal(assessment.status,201);
  const blockedMission=await call('sessions',{missionId:lesson.id});
  assert.equal(blockedMission.status,409);
  assert.equal(blockedMission.body.code,'STUDY_ASSESSMENT_RESUME_REQUIRED');
});

test('rota de avaliação independente não vaza gabarito e mantém idempotência',async t=>{
  const {sql,call}=await fixture(t);
  const topics=[
    'banking.sfn.introducao','banking.sfn.cmn','banking.sfn.bacen','banking.sfn.copom',
    'banking.sfn.cvm','banking.sfn.operadores','banking.sfn.seguros-previdencia',
    'banking.sfn.pagamentos-consorcios','banking.sfn.boss'
  ];
  await call('bootstrap');
  const insert=sql.prepare(`INSERT INTO study_topic_progress(
    username, topic_id, coverage_state, mastery_score, content_version_seen
  ) VALUES ('wellyton', ?, 3, 0, 2)`);
  for(const topic of topics)insert.run(topic);

  const state=await call('assessments/banking.sfn-foundation');
  assert.equal(state.status,200);
  assert.equal(state.body.availableForm,'A');
  assert.equal(state.body.questions,undefined);
  assert.doesNotMatch(JSON.stringify(state.body),/eval\.sfn\./);

  const started=await call('assessments/banking.sfn-foundation/start',{});
  assert.equal(started.status,201);
  assert.equal(started.body.formId,'A');
  assert.equal(started.body.questions.length,16);
  const q=started.body.questions[0];
  assert.match(q.id,/^eval\.sfn\.a/);
  assert.equal(q.answer,undefined);assert.equal(q.correct,undefined);assert.equal(q.explanation,undefined);

  const first=await call('assessments/'+started.body.assessmentId+'/answers',{questionId:q.id,selectedOption:0});
  assert.equal(first.status,200);assert.equal(first.body.recorded,true);
  assert.equal(first.body.correct,undefined);assert.equal(first.body.correctOption,undefined);
  const same=await call('assessments/'+started.body.assessmentId+'/answers',{questionId:q.id,selectedOption:0});
  assert.equal(same.status,200);assert.equal(same.body.recorded,false);
  const conflict=await call('assessments/'+started.body.assessmentId+'/answers',{questionId:q.id,selectedOption:1});
  assert.equal(conflict.status,409);assert.equal(conflict.body.code,'STUDY_ASSESSMENT_ANSWER_CONFLICT');
  const incomplete=await call('assessments/'+started.body.assessmentId+'/complete',{});
  assert.equal(incomplete.status,409);assert.equal(incomplete.body.code,'STUDY_ASSESSMENT_INCOMPLETE');
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


test('leitura concluída é persistida na transição para prática e permanece após sair',async t=>{
  const {call,start,lesson}=await fixture(t);

  let bootstrap=await call('bootstrap');
  assert.equal(bootstrap.status,200);
  assert.equal(bootstrap.body.pedagogyProtocol,1);
  assert.equal(bootstrap.body.pedagogicalStates[lesson.topicId].id,'not_started');

  const sessionId=await start(lesson);
  bootstrap=await call('bootstrap');
  assert.equal(bootstrap.body.pedagogicalStates[lesson.topicId].id,'reading');

  const first=await call('sessions/'+sessionId+'/reading-complete',{});
  assert.equal(first.status,200);
  assert.equal(first.body.recorded,true);
  assert.equal(first.body.coverageState,1);

  const repeated=await call('sessions/'+sessionId+'/reading-complete',{});
  assert.equal(repeated.status,200);
  assert.equal(repeated.body.recorded,false);
  assert.equal(repeated.body.coverageState,1);

  bootstrap=await call('bootstrap');
  assert.equal(bootstrap.body.progress[lesson.topicId].coverageState,1);
  assert.equal(bootstrap.body.pedagogicalStates[lesson.topicId].id,'practice');

  assert.equal((await call('sessions/'+sessionId,{durationSeconds:0},{method:'PATCH'})).status,200);
  bootstrap=await call('bootstrap');
  assert.equal(bootstrap.body.pedagogicalStates[lesson.topicId].id,'reading_complete');
});


test('erro recorrente só permanece ativo quando a tentativa mais recente continua errada',async t=>{
  const {call,start,lesson}=await fixture(t);
  const question=lesson.questions[0];

  for(let attempt=0;attempt<2;attempt++){
    const sessionId=await start(lesson);
    const wrong=await call('attempts',{sessionId,questionId:question.id,selectedOption:1});
    assert.equal(wrong.status,200);
    assert.equal(wrong.body.correct,false);
    assert.equal((await call('sessions/'+sessionId,{durationSeconds:0},{method:'PATCH'})).status,200);
  }

  let bootstrap=await call('bootstrap');
  assert.equal(bootstrap.body.errorPatternProtocol,1);
  assert.equal(bootstrap.body.metrics.recurringErrors,1);
  assert.equal(bootstrap.body.recurringErrors[lesson.topicId].count,1);
  assert.equal(bootstrap.body.recurringErrors[lesson.topicId].items[0].questionId,question.id);
  assert.equal(bootstrap.body.recurringErrors[lesson.topicId].items[0].wrongAttempts,2);
  assert.equal(bootstrap.body.recurringErrors[lesson.topicId].items[0].totalAttempts,2);

  const recoverySession=await start(lesson);
  const correct=await call('attempts',{sessionId:recoverySession,questionId:question.id,selectedOption:0});
  assert.equal(correct.status,200);
  assert.equal(correct.body.correct,true);
  assert.equal((await call('sessions/'+recoverySession,{durationSeconds:0},{method:'PATCH'})).status,200);

  bootstrap=await call('bootstrap');
  assert.equal(bootstrap.body.metrics.recurringErrors,0);
  assert.equal(bootstrap.body.recurringErrors[lesson.topicId].count,0);
  assert.deepEqual(bootstrap.body.recurringErrors[lesson.topicId].items,[]);
});


test('domínio recente usa tentativas reais e permanece provisório sem revisão',async t=>{
  const {call,start,lesson}=await fixture(t);
  const question=lesson.questions[0];

  const sessionId=await start(lesson);
  const correct=await call('attempts',{sessionId,questionId:question.id,selectedOption:0});
  assert.equal(correct.status,200);
  assert.equal(correct.body.correct,true);
  assert.equal((await call('sessions/'+sessionId,{durationSeconds:0},{method:'PATCH'})).status,200);

  const bootstrap=await call('bootstrap');
  assert.equal(bootstrap.body.domainProtocol,1);
  const domain=bootstrap.body.recentDomain.byTopic[lesson.topicId];
  assert.equal(domain.immediateScore,100);
  assert.equal(domain.score,70);
  assert.equal(domain.retentionScore,null);
  assert.equal(domain.status,'provisional');
  assert.equal(bootstrap.body.recentDomain.observedTopics,1);
  assert.equal(bootstrap.body.recentDomain.overallScore,70);
});
