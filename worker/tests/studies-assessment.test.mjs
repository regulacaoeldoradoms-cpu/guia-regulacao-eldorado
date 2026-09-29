import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { sqliteD1 } from './helpers/studies-sqlite.mjs';
import { sourceMap, PUBLISHED_MISSIONS } from '../studies-content/manifest.js';
import {
  ASSESSMENT_VERSION,
  BLOCK_ID,
  BLOCK_CONTENT_VERSION,
  FORM_SIZE,
  REQUIRED_TOPIC_IDS,
  ASSESSMENT_QUESTIONS,
  assessmentQuestionsForForm,
  validateAssessmentCatalog
} from '../studies-assessment-content/sfn-foundation-v1.js';
import {
  StudyAssessmentError,
  ensureAssessmentSchema,
  getAssessmentState,
  startIndependentAssessment,
  recordIndependentAssessmentAnswer,
  completeIndependentAssessment
} from '../study-assessments.js';

function fixture(t) {
  const sql = new DatabaseSync(':memory:');
  sql.exec('PRAGMA foreign_keys=ON');
  t.after(() => sql.close());
  const db = sqliteD1(sql);
  sql.exec(`CREATE TABLE study_topic_progress (
    username TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    coverage_state INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY(username, topic_id)
  )`);
  return {sql,db};
}

function seedPrerequisites(sql, username='wellyton') {
  const stmt=sql.prepare('INSERT INTO study_topic_progress(username, topic_id, coverage_state) VALUES (?, ?, 3)');
  for(const topicId of REQUIRED_TOPIC_IDS)stmt.run(username,topicId);
}

async function answerAll(db, assessment, chooser=(question)=>question.answer) {
  const byId=new Map(ASSESSMENT_QUESTIONS.map((item)=>[item.id,item]));
  for(const question of assessment.questions){
    const item=byId.get(question.id);
    await recordIndependentAssessmentAnswer(db,'wellyton',assessment.assessmentId,question.id,chooser(item));
  }
}

test('catálogo independente possui 32 itens balanceados e fontes conhecidas',()=>{
  assert.equal(ASSESSMENT_QUESTIONS.length,32);
  assert.deepEqual(validateAssessmentCatalog(new Set(sourceMap().keys())),[]);
  const a=assessmentQuestionsForForm('A'),b=assessmentQuestionsForForm('B');
  assert.equal(a.length,FORM_SIZE);assert.equal(b.length,FORM_SIZE);
  assert.equal(new Set([...a.map(x=>x.id),...b.map(x=>x.id)]).size,32);
  assert.doesNotMatch(JSON.stringify(PUBLISHED_MISSIONS),/eval\.sfn\./);
});

test('itens independentes não repetem literalmente nem quase copiam os prompts de treino',()=>{
  const training=PUBLISHED_MISSIONS.flatMap(mission=>(mission.questions||[]).map(question=>({
    id:question.id,prompt:question.prompt
  })));
  const normalize=value=>String(value||'').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  const stop=new Set(['qual','uma','para','como','mais','pela','pelo','essa','esse','esta','este','entre','sobre','quando','onde','com','sem','que','dos','das','nas','nos','por','seu','sua','suas','seus']);
  const tokens=value=>new Set(normalize(value).split(' ').filter(token=>token.length>3&&!stop.has(token)));
  const similarity=(left,right)=>{
    const a=tokens(left),b=tokens(right);let intersection=0;
    for(const token of a)if(b.has(token))intersection++;
    const union=new Set([...a,...b]).size;
    return union?intersection/union:0;
  };
  for(const item of ASSESSMENT_QUESTIONS){
    assert.ok(!training.some(question=>normalize(question.prompt)===normalize(item.prompt)),item.id+' repete prompt do treino');
    const best=Math.max(...training.map(question=>similarity(question.prompt,item.prompt)));
    assert.ok(best<0.75,`${item.id} está excessivamente próximo do treino: ${best}`);
  }
});

test('estado não libera avaliação antes de concluir aulas e Chefe',async t=>{
  const {db}=fixture(t);await ensureAssessmentSchema(db);
  const state=await getAssessmentState(db,'wellyton');
  assert.equal(state.blockId,BLOCK_ID);
  assert.equal(state.assessmentVersion,ASSESSMENT_VERSION);
  assert.equal(state.contentVersion,BLOCK_CONTENT_VERSION);
  assert.equal(state.prerequisitesComplete,false);
  assert.equal(state.availableForm,null);
  await assert.rejects(
    ()=>startIndependentAssessment(db,'wellyton'),
    error=>error instanceof StudyAssessmentError&&error.code==='STUDY_ASSESSMENT_PREREQUISITE_REQUIRED'
  );
});

test('Forma A inicia com 16 itens públicos e início repetido reutiliza a rodada',async t=>{
  const {sql,db}=fixture(t);await ensureAssessmentSchema(db);seedPrerequisites(sql);
  const first=await startIndependentAssessment(db,'wellyton');
  assert.equal(first.formId,'A');assert.equal(first.questions.length,16);
  for(const question of first.questions){
    assert.equal(question.answer,undefined);
    assert.equal(question.correct,undefined);
    assert.equal(question.explanation,undefined);
    assert.match(question.id,/^eval\.sfn\.a/);
  }
  const again=await startIndependentAssessment(db,'wellyton');
  assert.equal(again.assessmentId,first.assessmentId);
  assert.equal(sql.prepare("SELECT COUNT(*) n FROM study_assessment_rounds WHERE status='active'").get().n,1);
});

test('inícios concorrentes convergem para uma única rodada ativa',async t=>{
  const {sql,db}=fixture(t);await ensureAssessmentSchema(db);seedPrerequisites(sql);
  const [first,second]=await Promise.all([
    startIndependentAssessment(db,'wellyton'),
    startIndependentAssessment(db,'wellyton')
  ]);
  assert.equal(first.assessmentId,second.assessmentId);
  assert.equal(first.formId,'A');assert.equal(second.formId,'A');
  assert.equal(sql.prepare("SELECT COUNT(*) n FROM study_assessment_rounds WHERE status='active'").get().n,1);
});

test('resposta é idempotente e não revela correção durante a rodada',async t=>{
  const {sql,db}=fixture(t);await ensureAssessmentSchema(db);seedPrerequisites(sql);
  const round=await startIndependentAssessment(db,'wellyton');
  const question=assessmentQuestionsForForm('A')[0];
  const first=await recordIndependentAssessmentAnswer(db,'wellyton',round.assessmentId,question.id,question.answer);
  assert.equal(first.recorded,true);
  assert.equal(first.correct,undefined);assert.equal(first.correctOption,undefined);
  const same=await recordIndependentAssessmentAnswer(db,'wellyton',round.assessmentId,question.id,question.answer);
  assert.equal(same.recorded,false);
  await assert.rejects(
    ()=>recordIndependentAssessmentAnswer(db,'wellyton',round.assessmentId,question.id,(question.answer+1)%4),
    error=>error instanceof StudyAssessmentError&&error.code==='STUDY_ASSESSMENT_ANSWER_CONFLICT'
  );
});

test('fechamento incompleto falha; completo fixa score e resultado idempotente',async t=>{
  const {sql,db}=fixture(t);await ensureAssessmentSchema(db);seedPrerequisites(sql);
  const round=await startIndependentAssessment(db,'wellyton');
  const firstQuestion=assessmentQuestionsForForm('A')[0];
  await recordIndependentAssessmentAnswer(db,'wellyton',round.assessmentId,firstQuestion.id,firstQuestion.answer);
  await assert.rejects(
    ()=>completeIndependentAssessment(db,'wellyton',round.assessmentId),
    error=>error instanceof StudyAssessmentError&&error.code==='STUDY_ASSESSMENT_INCOMPLETE'
  );
  for(const question of assessmentQuestionsForForm('A').slice(1)){
    await recordIndependentAssessmentAnswer(db,'wellyton',round.assessmentId,question.id,question.answer);
  }
  const result=await completeIndependentAssessment(db,'wellyton',round.assessmentId);
  assert.equal(result.total,16);assert.equal(result.correct,16);assert.equal(result.score,100);
  assert.ok(result.diagnostics.length>=8);
  assert.deepEqual(await completeIndependentAssessment(db,'wellyton',round.assessmentId),result);
  assert.equal(sql.prepare("SELECT COUNT(*) n FROM study_assessment_rounds WHERE status='completed'").get().n,1);
});

test('fechamentos concorrentes devolvem exatamente o mesmo resultado persistido',async t=>{
  const {sql,db}=fixture(t);await ensureAssessmentSchema(db);seedPrerequisites(sql);
  const round=await startIndependentAssessment(db,'wellyton');await answerAll(db,round);
  const [first,second]=await Promise.all([
    completeIndependentAssessment(db,'wellyton',round.assessmentId),
    completeIndependentAssessment(db,'wellyton',round.assessmentId)
  ]);
  assert.deepEqual(first,second);
  const row=sql.prepare('SELECT status, result_json FROM study_assessment_rounds WHERE assessment_id=?').get(round.assessmentId);
  assert.equal(row.status,'completed');
  assert.deepEqual(first,JSON.parse(row.result_json));
});

test('Forma B exige sete dias e não reutiliza IDs da Forma A',async t=>{
  const {sql,db}=fixture(t);await ensureAssessmentSchema(db);seedPrerequisites(sql);
  const a=await startIndependentAssessment(db,'wellyton');await answerAll(db,a);
  await completeIndependentAssessment(db,'wellyton',a.assessmentId);
  let state=await getAssessmentState(db,'wellyton');
  assert.equal(state.availableForm,null);assert.ok(state.nextEligibleAt);
  await assert.rejects(
    ()=>startIndependentAssessment(db,'wellyton'),
    error=>error instanceof StudyAssessmentError&&error.code==='STUDY_ASSESSMENT_INTERVAL_REQUIRED'
  );

  sql.prepare("UPDATE study_assessment_rounds SET completed_at=datetime('now','-8 days') WHERE assessment_id=?").run(a.assessmentId);
  state=await getAssessmentState(db,'wellyton');
  assert.equal(state.availableForm,'B');
  const b=await startIndependentAssessment(db,'wellyton');
  assert.equal(b.formId,'B');assert.equal(b.questions.length,16);
  const idsA=new Set(a.questions.map(q=>q.id));
  assert.ok(b.questions.every(q=>!idsA.has(q.id)));
});

test('versão incompatível invalida somente rodada ativa sem apagar histórico',async t=>{
  const {sql,db}=fixture(t);await ensureAssessmentSchema(db);seedPrerequisites(sql);
  const id=crypto.randomUUID();
  sql.prepare(`INSERT INTO study_assessment_rounds(
    assessment_id, username, block_id, form_id, assessment_version, content_version, question_ids
  ) VALUES (?, 'wellyton', ?, 'A', 0, ?, ?)`).run(
    id,BLOCK_ID,BLOCK_CONTENT_VERSION,JSON.stringify(assessmentQuestionsForForm('A').map(q=>q.id))
  );
  const state=await getAssessmentState(db,'wellyton');
  assert.equal(state.active,null);
  assert.equal(sql.prepare('SELECT status FROM study_assessment_rounds WHERE assessment_id=?').get(id).status,'invalidated');
  assert.equal(state.availableForm,'A');
});

test('serviço não concede XP nem altera cobertura/prontidão ao concluir',async t=>{
  const {sql,db}=fixture(t);await ensureAssessmentSchema(db);seedPrerequisites(sql);
  sql.exec(`CREATE TABLE study_xp_events(
    event_id TEXT PRIMARY KEY, username TEXT, event_type TEXT, ref_id TEXT, points INTEGER
  )`);
  const before=sql.prepare('SELECT topic_id, coverage_state FROM study_topic_progress ORDER BY topic_id').all();
  const round=await startIndependentAssessment(db,'wellyton');await answerAll(db,round,(question)=>question.answer);
  await completeIndependentAssessment(db,'wellyton',round.assessmentId);
  const after=sql.prepare('SELECT topic_id, coverage_state FROM study_topic_progress ORDER BY topic_id').all();
  assert.deepEqual(after,before);
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM study_xp_events').get().n,0);
});
